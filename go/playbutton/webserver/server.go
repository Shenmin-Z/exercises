package webserver

import (
	"net/http"
)

func Serve() {
	static()
	http.ListenAndServe(":3000", nil)
}
