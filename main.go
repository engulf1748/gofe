package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"codeberg.org/ar324/gofe/api"
)

type Config struct {
	APIDomain  string `json:"api_domain"`
	NextDomain string `json:"next_domain"`
}

var config Config

// Initialized when server starts
var openSearchXML string

// Marshals 'i' and writes to ResponseWriter
func sendJSON(w http.ResponseWriter, i interface{}) error {
	b, err := json.Marshal(i)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return fmt.Errorf("sendJSON: error parsing to JSON: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")

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

	page := 0

	if p != "" {
		var err error
		page, err = strconv.Atoi(p)
		if err == nil && page < 1 { // while api is 0-indexed, this implementation is not
			err = fmt.Errorf("`p` is less than 1")
		}
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		page--
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

func serveOpenSearchXML(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/opensearchdescription+xml")
	fmt.Fprintf(w, openSearchXML)
}

func main() {
	b, err := os.ReadFile("config.json")
	if err != nil {
		panic(fmt.Errorf("main: couldn't read config.json: %v", err))
	}
	err = json.Unmarshal(b, &config)
	if err != nil {
		panic(fmt.Errorf("main: couldn't parse config.json: %v", err))
	}

	b, err = os.ReadFile("opensearch-template")
	if err != nil {
		panic(fmt.Errorf("main: couldn't read OpenSearch XML template: %v", err))
	}
	openSearchXML = fmt.Sprintf(string(b), config.NextDomain, config.NextDomain, config.APIDomain)

	mux := http.NewServeMux()
	m := map[string]func(http.ResponseWriter, *http.Request){
		"/search": search,
		// https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki
		"/opensuggest":    openSuggest,
		"/opensearch.xml": serveOpenSearchXML,
	}
	for k, v := range m {
		mux.Handle(k, loggingHandler(nil, corsHandler(http.HandlerFunc(v))))
	}

	addr := strings.TrimPrefix(config.APIDomain, "http://")
	addr = strings.TrimPrefix(addr, "https://")
	log.Fatal(http.ListenAndServe(addr, mux))
}
