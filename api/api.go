package api

import (
	"fmt"
	"net/http"
	// "os"
	"golang.org/x/net/html"
	"net/url"
	"strings"
)

// Query URL
const qurl = "https://google.com/search?&q=%s"

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

func Search(term string) (Results, error) {
	term = url.QueryEscape(term)
	resp, err := http.Get(fmt.Sprintf(qurl, term))
	if err != nil {
		return nil, err
	}
	n, err := html.Parse(resp.Body)
	if err != nil {
		return nil, err
	}
	rs := findURLs(n)
	rs.sanitize()
	return rs, nil
}
