package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"codeberg.org/ar324/gofe/api"
)

func search(w http.ResponseWriter, r *http.Request) {
	q, ok := r.URL.Query()["q"]
	if !ok {
		return
	}
	rs, err := api.Search(strings.Join(q, " "))
	if err != nil {
		return
	}
	d, err := json.Marshal(rs)
	if err != nil {
		return
	}
	fmt.Fprintf(w, string(d))
}

func suggest(w http.ResponseWriter, r *http.Request) {
	q, ok := r.URL.Query()["q"]
	if !ok {
		return
	}
	rs, err := api.Suggest(strings.Join(q, " "))
	if err != nil {
		return
	}
	d, err := json.Marshal(rs)
	if err != nil {
		return
	}
	fmt.Fprintf(w, string(d))
}

func main() {
	port := os.Args[1]
	http.HandleFunc("/search", search)
	http.HandleFunc("/suggest", suggest)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("localhost:%s", port), nil))
}
