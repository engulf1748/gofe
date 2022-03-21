package api

import (
	"testing"
)

func TestSearch(t *testing.T) {
	rs, err := Search("golang is the best")
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	for _, v := range rs {
		t.Logf("URL: %q Description: %q\n", v.URL, v.Desc)
	}
	Suggest("gol")
}
