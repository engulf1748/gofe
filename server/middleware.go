package main

import (
	"io"
	"net/http"
)

func loggingHandler(out io.Writer, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if out != nil {
			// do do something
		}
		// IP: r.RemoteAddr URL: r.URL.String())
		next.ServeHTTP(w, r)
	})
}

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.NextDomain)
		next.ServeHTTP(w, r)
	})
}
