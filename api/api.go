package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/net/html"
)

//TODO: pass region as parameter
// reference: https://github.com/benbusby/whoogle-search/issues/544
// query URL
const qurl = "https://google.com/search?" +
	"&q=%s" + // query
	"&start=%d" + // page number
	"&gl=%s" // Region

// suggestions URL
// xssi = t seems to be necessary for application/json output
const surl = "https://www.google.com/complete/search?&client=firefox&xssi=t" +
	"&q=%s" +
	"&gl=%s"

const DefaultRegion = "US"

// Represents a link with context.
type Link struct {
	URL     string
	Desc    string
	Context string
}

// remove's Google's claws
// makes 'URL' empty if there's any issue parsing it
func (l *Link) sanitize() {
	u, err := url.Parse(l.URL) // /url?q= . . .
	if err != nil {
		l.URL = ""
		return // for 'safety'
	}
	// if Google has returned an actual link
	if u.Scheme != "" {
		u.RawQuery = "" // remove claws
		l.URL = u.String()
		return
	}
	s, err := url.PathUnescape(u.Query().Get("q")) // 'q' houses the link
	if err != nil {
		l.URL = ""
		return
	}
	l.URL = s
}

// A complete search result.
type Result struct {
	Links       []*Link
	RateLimited bool
	DYM         string // 'did you mean'
	SRF         string // 'showing results for'
}

func (rs *Result) sanitize() {
	links := make([]*Link, 0)
	for _, v := range rs.Links {
		v.sanitize()
		// ignore 'empty' links
		if v.URL == "" {
			continue
		}
		links = append(links, v)
	}
	rs.Links = links
}

// A slice of strings to store suggestions in, essentially.
type Suggestions []string

// WOAH!
type suggestResponse []interface{}

func getContent(n *html.Node) string {
	var b strings.Builder
	var gc func(n *html.Node)
	gc = func(n *html.Node) {
		if n == nil {
			return
		}
		if n.Type == html.TextNode {
			b.WriteString(n.Data)
			return
		}
		// depth-first search
		for n = n.FirstChild; n != nil; n = n.NextSibling {
			gc(n)
		}
	}
	gc(n)
	return b.String()
}

func findURLs(n *html.Node) Result {
	rs := Result{Links: make([]*Link, 0)}
	// main ensures we're only considering links inside <div id="main">
	var f func(*html.Node, bool)
	f = func(n *html.Node, main bool) {
		if main && n.Type == html.ElementNode && n.Data == "a" {
			fc := n.FirstChild
			var desc string
			if fc != nil && fc.Data == "h3" {
				var link Link
				if fc.FirstChild != nil {
					desc = fc.FirstChild.FirstChild.Data
				}
				for _, v := range n.Attr {
					if v.Key == "href" {
						link.URL = v.Val
						link.Desc = strings.ToValidUTF8(desc, "")
						break
					}
				}
				// "context"
				if p := n.Parent; p.NextSibling != nil {
					p = p.NextSibling
					s := getContent(p)
					link.Context = strings.ToValidUTF8(s, "")
				}
				// my sincerest apologies
				if link.URL != "" {
					rs.Links = append(rs.Links, &link)
				}
			}
		}
		if !main && n.Data == "div" {
			for _, v := range n.Attr {
				if v.Key == "id" && v.Val == "main" {
					main = true
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c, main)
		}
	}
	f(n, false)
	return rs
}

// finds 'did you mean' or 'showing results for'
func findExtra(n *html.Node) (dym string, srf string) {
	var f func(n *html.Node)
	f = func(n *html.Node) {
		if dym != "" && srf != "" {
			return
		}
		if n.Type == html.TextNode && strings.Contains(n.Data, "Did you mean:") {
			if n.NextSibling != nil {
				dym = getContent(n.NextSibling)
			}
		}
		if n.Type == html.TextNode && strings.Contains(n.Data, "Showing results for") {
			if n.NextSibling != nil {
				srf = getContent(n.NextSibling)
			}
		}
		if n.FirstChild != nil {
			f(n.FirstChild)
		}
		if n.NextSibling != nil {
			f(n.NextSibling)
		}
	}
	f(n)
	return dym, srf
}

// we don't want to wait on a request forever, do we?
func timeoutClient() *http.Client {
	return &http.Client{
		Timeout: 20 * time.Second,
	}
}

func checkRateLimit(sc int) bool {
	rlMap := map[int]bool{
		301: true,
		302: true,
		429: true,
	}
	return rlMap[sc]
}

type SearchParameters struct {
	Query string
	Page int
}

func (sp SearchParameters) Valid() bool {
	if sp.Page < 1 {
		return false
	}
	return true
}

type SearchConfig struct {
	Region string
	// SafeSearch, . . . to come
}

func (sc SearchConfig) getQueryURL(qp SearchParameters) *url.URL {
	if sc.Region == "" {
		sc.Region = DefaultRegion // not a pointer receiver???don't fret
	}
	query := url.QueryEscape(qp.Query)
	u, err := url.Parse(fmt.Sprintf(qurl, query, (qp.Page - 1) * 10, sc.Region))
	if err != nil {
		panic(err) // Yeah, I'm certain.
	}
	return u
}

// Queries Google Search for `query` and returns a `Result`. Note that `page`
// is 0-indexed. There might be an error, so do check for it before using the
// returned `Result`.
func (sc SearchConfig) Search(sp SearchParameters) (Result, error) {
	var rs Result

	if !sp.Valid() {
		return rs, errors.New("Search: invalid SearchParameters")
	}

	if strings.TrimSpace(sp.Query) == "" {
		return rs, nil
	}

	u := sc.getQueryURL(sp)

	r := &http.Request{
		URL:    u,
		Header: make(http.Header),
	}

	client := timeoutClient()
	resp, err := client.Do(r)
	if err != nil {
		return rs, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		if checkRateLimit(resp.StatusCode) {
			rs.RateLimited = true
			return rs, nil
		}
		return rs, fmt.Errorf("Search: http.Get returned non-200 status code: %v", resp.StatusCode)
	}

	n, err := html.Parse(resp.Body)
	if err != nil {
		return rs, err
	}

	rs = findURLs(n)
	rs.sanitize()
	rs.DYM, rs.SRF = findExtra(n)
	return rs, nil
}

// Converts an ISO-8859-1 encoded byte slice to a UTF-8 string
func iso8859ToUTF8(b []byte) string {
	buf := make([]rune, len(b))
	for i, v := range b {
		buf[i] = rune(v)
	}
	return string(buf)
}

type SugConfig struct {
	Region string
}

func (sc SugConfig) getSuggestionsURL(query string) *url.URL {
	if sc.Region == "" {
		sc.Region = DefaultRegion // not a pointer receiver???don't fret
	}
	// Do we need SugParameters too? I do not think so.
	query = url.QueryEscape(query)
	u, err := url.Parse(fmt.Sprintf(surl, query, sc.Region))
	if err != nil {
		panic(err)
	}
	return u
}

// Suggests queries based on `query` and returns a `Suggestions`. There might be
// an error, so do check for it before using the returned `Suggestions`.
func (sc SugConfig) Suggest(query string) (Suggestions, error) {
	if strings.TrimSpace(query) == "" {
		return Suggestions{}, nil
	}

	u := sc.getSuggestionsURL(query)
	req := &http.Request{
		URL:    u,
		Header: make(http.Header),
	}

	client := timeoutClient()
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Suggest: http.Get returned non-200 status code: %v", resp.StatusCode)
	}
	b, err := io.ReadAll(resp.Body)
	b = b[4:] // )]}' is needlessly prefixed to the response. any idea why?
	// response is ISO-8859-1 encoded
	// []byte -> []rune -> string -> []byte
	// there is of course a better way, I'm just too lazy at the moment
	rb := []byte(iso8859ToUTF8(b))

	var sr suggestResponse
	err = json.Unmarshal(rb, &sr)
	if err != nil {
		return nil, fmt.Errorf("Suggest: couldn't unmarshal: %v", err)
	}
	if len(sr) < 2 {
		return nil, fmt.Errorf("Suggest: couldn't understand response")
	}
	r, ok := sr[1].([]interface{})
	if !ok {
		return nil, fmt.Errorf("Suggest: couldn't understand response")
	}
	rs := make(Suggestions, len(r))
	for i, v := range r {
		switch vs := v.(type) {
		case string:
			rs[i] = vs
		default:
			return nil, fmt.Errorf("Suggest: couldn't understand response")
		}
	}
	return rs, nil
}
