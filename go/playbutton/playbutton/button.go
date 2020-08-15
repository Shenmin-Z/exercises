package playbutton

import (
	"image"

	"github.com/fogleman/gg"
)

func Button(img image.Image, radius int) image.Image {
	bounds := img.Bounds()
	width, height := bounds.Dx(), bounds.Dy()
	w := float64(width)
	h := float64(height)
	r := float64(radius)

	if r < 0 {
		min := w
		if h < w {
			min = h
		}
		r = min / 5
	}

	dc := gg.NewContext(width, height)
	dc.DrawImage(img, 0, 0)

	// Draw Triangle
	rr := r / 4
	dc.MoveTo(w/2-rr, h/2-rr*2)
	dc.LineTo(w/2+rr*2, h/2)
	dc.LineTo(w/2-rr, h/2+rr*2)
	dc.ClosePath()

	dc.Clip()
	dc.InvertMask()

	dc.DrawCircle(w/2, h/2, r)

	dc.SetRGBA(1, 1, 1, .95)
	dc.Fill()

	return dc.Image()
}
