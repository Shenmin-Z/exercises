package webserver

import (
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// Serve static files
func static() {
	var files []string

	err := filepath.Walk("webserver/static", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			log.Fatal(err)
		}
		if info.IsDir() {
			return nil
		}

		// only serve js and css files
		//suf := filepath.Ext(path)
		//if suf == ".js" || suf == ".css" {
		//  files = append(files, path)
		//}
		files = append(files, path)
		return nil
	})

	if err != nil {
		panic(err)
	}

	for _, path := range files {
		url := path[len("webserver"):]
		fPath := path
		http.HandleFunc(url, func(w http.ResponseWriter, r *http.Request) {
			f, err := os.Open(fPath)
			defer f.Close()
			if err != nil {
				log.Fatal(err)
			}
			_, err = io.Copy(w, f)
			if err != nil {
				log.Fatal(err)
			}
		})
	}

	http.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		f, err := os.Open("webserver/static/index.html")
		defer f.Close()
		if err != nil {
			log.Fatal(err)
		}
		_, err = io.Copy(rw, f)
		if err != nil {
			log.Fatal(err)
		}
	})
}
