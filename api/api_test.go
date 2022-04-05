package api

import (
	"testing"
)

func TestSearch(t *testing.T) {
	q := "why no me meaning"
	rs, err := Search(q, 0)
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	t.Logf("Query: %q\n", q)
	t.Logf("Did you mean: %q\n", rs.DYM)
	for _, v := range rs.Links {
		t.Logf("URL: %q\nDescription: %q\nContext: %q\n\n", v.URL, v.Desc, v.Context)
	}
}

func TestSuggest(t *testing.T) {
	q := "soy"
	rs, err := Suggest(q)
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	t.Logf("Query: %q\n", q)
	for _, v := range rs {
		t.Logf("suggestion: %s\n", v)
	}
}
