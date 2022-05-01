package api

import (
	"testing"
)

func TestSearch(t *testing.T) {
	sc := SearchConfig{
		Region: "JP",
	}
	q := SearchParameters{
		Query: "birds",
		Page: 1,
	}
	rs, err := sc.Search(q)
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	t.Logf("Query: %q\n", q)
	t.Logf("Did you mean: %q\n", rs.DYM)
	t.Logf("Showing results for: %q\n", rs.SRF)
	for _, v := range rs.Links {
		t.Logf("URL: %q\nDescription: %q\nContext: %q\n\n", v.URL, v.Desc, v.Context)
	}
}

func TestSuggest(t *testing.T) {
	sc := SugConfig{
		Region: "SA",
	}
	q := "soy"
	rs, err := sc.Suggest(q)
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	t.Logf("Query: %q\n", q)
	for _, v := range rs {
		t.Logf("suggestion: %s\n", v)
	}
}
