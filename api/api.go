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

// Represents a single search result.
type Result struct {
	URL     string
	Desc    string
	Context string
}

// remove's Google's claws
func (r *Result) sanitize() {
	v := r.URL
	// TODO: something less kludgy, perhaps?
	if strings.HasPrefix(v, "/url?q=") {
		v = strings.Replace(v, "/url?q=", "", 1)
		v = strings.Split(v, "&sa")[0]
		// u, err := url.Parse(v)
		// if err != nil { continue }
	}
	r.URL = v
}

// A slice of Result pointers.
type Results []*Result

func (rs Results) sanitize() {
	for _, v := range rs {
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
			b.WriteString(" ")
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

func findURLs(n *html.Node) Results {
	rs := make(Results, 0)
	// main ensures we're only considering links inside <div id="main">
	var f func(*html.Node, bool)
	f = func(n *html.Node, main bool) {
		if main && n.Type == html.ElementNode && n.Data == "a" {
			fc := n.FirstChild
			var desc string
			if fc != nil && fc.Data == "h3" {
				var result Result
				if fc.FirstChild != nil {
					desc = fc.FirstChild.FirstChild.Data
				}
				for _, v := range n.Attr {
					if v.Key == "href" {
						result.URL = v.Val
						result.Desc = strings.ToValidUTF8(desc, "")
						break
					}
				}
				// "context"
				if p := n.Parent; p.NextSibling != nil {
					p = p.NextSibling
					s := getContent(p)
					result.Context = strings.ToValidUTF8(s, "")
				}
				// my sincerest apologies
				if result.URL != "" {
					rs = append(rs, &result)
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

// we don't want to wait on a request forever, do we?
func timeoutClient() *http.Client {
	return &http.Client{
		Timeout: 20 * time.Second,
	}
}

// Queries Google Search for `query` and returns a `Results`. Note that `page`
// is 0-indexed. There might be an error, so do check for it before using the
// returned `Results`.
func Search(query string, page int) (Results, error) {
	page *= 10 // I do not know why—ask Google
	query = url.QueryEscape(query)
	client := timeoutClient()
	resp, err := client.Get(fmt.Sprintf(qurl, query, page))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Search: http.Get returned non-200 status code: %v", resp.StatusCode)
	}
	n, err := html.Parse(resp.Body)
	if err != nil {
		return nil, err
	}
	rs := findURLs(n)
	rs.sanitize()
	return rs, nil
}

// Suggests queries based on `query` and returns a `Suggestions`. There might be
// an error, so do check for it before using the returned `Suggestions`.
func Suggest(query string) (Suggestions, error) {
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
	var sr suggestResponse
	err = json.Unmarshal(b, &sr)
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
