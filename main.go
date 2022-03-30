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

type Config struct {
	APIDomain   string `json:"api_domain"`
	APIBindAddr string `json:"api_bind_addr"`

	APITLS   bool   `json:"api_tls"`
	CertPath string `json:"cert_path"`
	KeyPath  string `json:"key_path"`

	// the front-end
	Domain string `json:"domain"`
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

func catchAll(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
}

func main() {
	// config
	b, err := os.ReadFile("config.json")
	if err != nil {
		panic(fmt.Errorf("main: couldn't read config.json: %v", err))
	}
	err = json.Unmarshal(b, &config)
	if err != nil {
		panic(fmt.Errorf("main: couldn't parse config.json: %v", err))
	}

	// OpenSearch
	b, err = os.ReadFile("opensearch-template")
	if err != nil {
		panic(fmt.Errorf("main: couldn't read OpenSearch XML template: %v", err))
	}
	openSearchXML = fmt.Sprintf(string(b), config.Domain, config.Domain, config.APIDomain)

	// log file
	f, err := os.OpenFile("server.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0600)
	if err != nil {
		panic(fmt.Errorf("main: couldn't open server.log: %v", err))
	}

	mux := http.NewServeMux()
	m := map[string]func(http.ResponseWriter, *http.Request){
		"/":       catchAll,
		"/search": search,
		// https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki
		"/opensuggest":    openSuggest,
		"/opensearch.xml": serveOpenSearchXML,
	}
	for k, v := range m {
		mux.Handle(k, loggingHandler(f, corsHandler(http.HandlerFunc(v))))
	}

	if config.APITLS {
		log.Fatal(http.ListenAndServeTLS(config.APIBindAddr, config.CertPath, config.KeyPath, mux))
	} else { // if TLS server exits
		log.Fatal(http.ListenAndServe(config.APIBindAddr, mux))
	}
}
