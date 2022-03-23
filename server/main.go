package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"codeberg.org/ar324/gofe/api"
)

// Accepts any type `rs` and converts it to a
// JSON string. This is then outputted directly
// to the response via the ResponseWriter.
func writeJSONOutput(w http.ResponseWriter, rs interface{}) error {
	d, err := json.Marshal(rs)

	if err != nil {
		return fmt.Errorf("writeOutput: error parsing to JSON: %v", err)
	}

	fmt.Fprintf(w, string(d))
	return nil
}

func search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q") // search query
	p := r.URL.Query().Get("p") // page number

	page := 1

	if p != "" {
		var err error
		page, err = strconv.Atoi(p)
		if err != nil {
			return
		}
	}

	rs, err := api.Search(q, page)
	if err != nil {
		return
	}

	writeJSONOutput(w, rs)
}

func suggest(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q") // suggestion query

	rs, err := api.Suggest(q)
	if err != nil {
		return
	}

	writeJSONOutput(w, rs)
}

func main() {
	port := os.Args[1]
	http.HandleFunc("/search", search)
	http.HandleFunc("/suggest", suggest)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("localhost:%s", port), nil))
}
