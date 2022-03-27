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
		logger = log.New(out, "\t", log.LstdFlags|log.LUTC|log.Lmsgprefix)
	}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		lw := newLogResponseWriter(w)

		next.ServeHTTP(lw, r)

		if logger != nil {
			// format: TIME PATH [Only the path component: we do not log the query parameters] RESULT-CODE
			// log.LstdFlags takes care of date and time
			logger.Printf("%s\t%d\n", r.URL.Path, lw.statusCode)
		}
	})
}

func corsHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", config.NextDomain)
		next.ServeHTTP(w, r)
	})
}
