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

// Gets the query parameter `p` from the URL.
// If there's an issue, an error is thrown.
// If not, the one-item array is joined into
// a string and returned.
func getURLParameter(r *http.Request, p string) (string, bool) {
	query, ok := r.URL.Query()[p]
	return strings.Join(query, " "), ok
}

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
	q, qOk := getURLParameter(r, "q")
	ps, pOk := getURLParameter(r, "p")

	if !qOk {
		return
	}

	page := 1

	if pOk {
		var err error
		page, err = strconv.Atoi(ps)
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
	q, qOk := getURLParameter(r, "q")

	if !qOk {
		return
	}

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
