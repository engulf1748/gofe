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

// Marshals 'i' and writes to ResponseWriter
func sendJSON(w http.ResponseWriter, i interface{}) error {
	b, err := json.Marshal(i)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("sendJSON: error parsing to JSON: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

	_, err = w.Write(b)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("sendJSON: couldn't write to ResponseWriter: %v", err)
	}

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
			w.WriteHeader(http.StatusBadRequest)
			return
		}
	}

	rs, err := api.Search(q, page)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	sendJSON(w, rs)
}

func openSuggest(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q") // suggestion query

	rs, err := api.Suggest(q)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var s []interface{}
	s = append(s, q)
	s = append(s, rs)

	sendJSON(w, s)
}

func main() {
	port := os.Args[1]
	http.HandleFunc("/search", search)
	// I deduced the format by sending requests to these links (assume 'test' is the query):
	// https://www.startpage.com/suggestions?q=test&format=opensearch
	// https://searx.xyz/autocompleter?q=test
	// https://duckduckgo.com/ac/?q=test&type=list
	// ["test",["testbook","testbook login","test speed","testzone","test internet speed","testing","test microphone","testosterone"]]
	http.HandleFunc("/opensuggest", openSuggest)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("localhost:%s", port), nil))
}
