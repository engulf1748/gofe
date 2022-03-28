package main

import (
	"io"
	"log"
	"net/http"
)

var logger *log.Logger

// to intercept http.ResponseWriter's WriteHeader method (to capture return code)
// informative reference: https://ndersson.me/post/capturing_status_code_in_net_http/
type logResponseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (lrw *logResponseWriter) WriteHeader(sc int) {
	lrw.ResponseWriter.WriteHeader(sc)
	lrw.statusCode = sc
}

func newLogResponseWriter(w http.ResponseWriter) *logResponseWriter {
	return &logResponseWriter{w, http.StatusOK}
}

func loggingHandler(out io.Writer, next http.Handler) http.Handler {
	if out != nil {
		logger = log.New(out, "", log.LstdFlags|log.LUTC)
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lw := newLogResponseWriter(w)

		next.ServeHTTP(lw, r)

		if logger != nil {
			// format: TIME PATH [Only the path component: we do not log the query parameters] RESULT-CODE
			// log.LstdFlags takes care of date and time
			// 2022/03/27 03:03:24 /invalid 404
			// 2022/03/27 03:03:33 /search 200
			// 2022/03/27 03:03:38 /opensuggest 200
			// 2022/03/27 03:03:44 /opensuggest 500
			// 2022/03/27 03:03:50 /invliad/path 404
			// 2022/03/27 03:04:00 /search 200
			logger.Printf("%s %d\n", r.URL.Path, lw.statusCode)
		}
	})
}

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// allow requests from config.Domain
		w.Header().Set("Access-Control-Allow-Origin", config.Domain)
		next.ServeHTTP(w, r)
	})
}
