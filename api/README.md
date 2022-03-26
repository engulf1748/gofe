# Gofë Google Search API

[![Go Reference](https://pkg.go.dev/badge/codeberg.org/ar324/gofe/api.svg)](https://pkg.go.dev/codeberg.org/ar324/gofe/api)

This package provides an API to use Google Search without using Google Search.

## Usage

```go
package main

import (
	"fmt"

	"codeberg.org/ar324/gofe/api"
)

func main() {
	rs, err := api.Search("golang", 0)
	if err != nil {
		panic(err)
	}
	for _, v := range rs {
		fmt.Printf("URL: %s, Description: %s, Context: %s\n", v.URL, v.Desc, v.Context)
		// URL: https://go.dev/, Description: The Go Programming Language, Context: Connect Twitter GitHub Slack r/golang Meetup Golang Weekly. The Go Gopher. Copyright  Terms of Service  Privacy Policy  Report an Issue  Google logo. Downloads Get Started
		// . . .
	}

	sg, err := api.Suggest("golan")
	if err != nil {
		panic(err)
	}
	for _, v := range sg {
		fmt.Println(v)
		// golang
		// golan heights
		// golang tutorial
		// goland
		// golang playground
		// . . .
	}
}
```
