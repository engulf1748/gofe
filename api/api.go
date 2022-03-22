package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	// "os"
	"golang.org/x/net/html"
	"net/url"
	"strings"
)

// Query URL
const qurl = "https://google.com/search?&q=%s&start=%d"

// Suggestions URL
// xssi = t seems to be necessary for application/json output
const surl = "https://www.google.com/complete/search?q=%s&client=firefox&xssi=t"

type Result struct {
	URL  string
	Desc string
}

// Remove's Google's claws
func (r *Result) sanitize() {
	v := r.URL
	// TODO: Something less kludgy, perhaps?
	if strings.HasPrefix(v, "/url?q=") {
		v = strings.Replace(v, "/url?q=", "", 1)
		v = strings.Split(v, "&sa")[0]
		// u, err := url.Parse(v)
		// if err != nil { continue }
	}
	r.URL = v
}

type Results []*Result

func (rs Results) sanitize() {
	for _, v := range rs {
		v.sanitize()
	}
}

type Suggestions []string

// WOAH!
type suggestResponse []interface{}

func findURLs(n *html.Node) Results {
	rs := make(Results, 0)
	// main ensures we're only considering links inside <div id="main">
	var f func(*html.Node, bool)
	f = func(n *html.Node, main bool) {
		if main && n.Type == html.ElementNode && n.Data == "a" {
			fc := n.FirstChild
			var desc string
			if fc != nil && fc.Data == "h3" {
				if fc.FirstChild != nil {
					desc = fc.FirstChild.FirstChild.Data
				}
				for _, v := range n.Attr {
					if v.Key == "href" {
						rs = append(rs, &Result{v.Val, desc})
					}
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

func Search(term string, page int) (Results, error) {
	page *= 10 // I do not know why—ask Google
	term = url.QueryEscape(term)
	resp, err := http.Get(fmt.Sprintf(qurl, term, page))
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

func Suggest(term string) (Suggestions, error) {
	term = url.QueryEscape(term)
	resp, err := http.Get(fmt.Sprintf(surl, term))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Suggest: http.Get returned non-200 status code: %v", resp.StatusCode)
	}
	b, err := io.ReadAll(resp.Body)
	b = b[4:] // )]}' is needlessly prefixed to the response
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
		vs, ok := v.(string)
		if !ok {
			return nil, fmt.Errorf("Suggest: couldn't understand response")
		}
		rs[i] = vs
	}
	return rs, nil
}
