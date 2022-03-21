package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	// "net/url"
	"golang.org/x/net/html"
)

type Result struct {
	URL  string
	Desc string
}

func (r *Result) pruneURL() {
	v := r.URL
	if strings.HasPrefix(v, "/url?q=") {
		v = strings.Replace(v, "/url?q=", "", 1)
		v = strings.Split(v, "&sa")[0]
		// u, err := url.Parse(v)
		// if err != nil { continue }
	}
	r.URL = v
}

const qurl = "https://google.com/search?&q=%s"

func pS(s []string) {
	for _, v := range s {
		fmt.Println(v)
	}
}

func main() {
	query := os.Args[1]
	resp, err := http.Get(fmt.Sprintf(qurl, query))
	if err != nil {
		panic(err)
	}
	n, err := html.Parse(resp.Body)
	if err != nil {
		panic(err)
	}
	results := make([]*Result, 0)
	var f func(n *html.Node, main bool)
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
						results = append(results, &Result{v.Val, desc})
					}
				}
			}
		}
		if !main {
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
	for _, v := range results {
		v.pruneURL()
		fmt.Println(*v)
	}
}
