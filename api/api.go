package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/net/html"
)

// query URL
const qurl = "https://google.com/search?&q=%s&start=%d"

// suggestions URL
// xssi = t seems to be necessary for application/json output
const surl = "https://www.google.com/complete/search?q=%s&client=firefox&xssi=t"

// Represents a link with context.
type Link struct {
	URL     string
	Desc    string
	Context string
}

// remove's Google's claws
func (l *Link) sanitize() {
	v := l.URL
	// TODO: something less kludgy, perhaps?
	if strings.HasPrefix(v, "/url?q=") {
		v = strings.Replace(v, "/url?q=", "", 1)
		v = strings.Split(v, "&sa")[0]
		u, err := url.PathUnescape(v)
		if err != nil {
			// TODO
		}
		v = u
	}
	l.URL = v
}

// A complete search result.
type Result struct {
	Links []*Link
	DYM   string // 'did you mean'
	SRF   string // 'showing results for'
}

func (rs Result) sanitize() {
	for _, v := range rs.Links {
		v.sanitize()
	}
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

// Queries Google Search for `query` and returns a `Result`. Note that `page`
// is 0-indexed. There might be an error, so do check for it before using the
// returned `Result`.
func Search(query string, page int) (Result, error) {
	var rs Result

	if strings.TrimSpace(query) == "" {
		return rs, nil
	}

	page *= 10 // I do not know why—ask Google
	query = url.QueryEscape(query)

	u, err := url.Parse(fmt.Sprintf(qurl, query, page))
	if err != nil {
		panic(err)
	}

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

// Suggests queries based on `query` and returns a `Suggestions`. There might be
// an error, so do check for it before using the returned `Suggestions`.
func Suggest(query string) (Suggestions, error) {
	if strings.TrimSpace(query) == "" {
		return Suggestions{}, nil
	}

	query = url.QueryEscape(query)
	client := timeoutClient()
	resp, err := client.Get(fmt.Sprintf(surl, query))
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
