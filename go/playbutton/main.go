package main

import (
	"flag"
	"image"
	"image/jpeg"
	"log"
	"os"

	"github.com/shenmin-z/playbutton/playbutton"
)

func main() {
	radius := flag.Int("r", -1, "radius of button")
	output := flag.String("o", "output.jpg", "output filename")

	flag.Parse()

	if flag.NArg() != 1 {
		flag.Usage()
		os.Exit(2)
	}

	input := flag.Args()[0]
	f, err := os.Open(input)
	if err != nil {
		log.Fatal(err)
		os.Exit(2)
	}
	img, _, err := image.Decode(f)
	if err != nil {
		log.Fatal(err)
	}
	f.Close()

	img = playbutton.Button(img, *radius)
	f, err = os.Create(*output)
	if err != nil {
		log.Fatal(err)
	}
	opt := jpeg.Options{
		Quality: 90,
	}
	err = jpeg.Encode(f, img, &opt)
	if err != nil {
		log.Fatal(err)
	}
	f.Close()
}
