package playbutton

import (
	"image"

	"github.com/fogleman/gg"
)

func Button(img image.Image, radius int, label string) image.Image {
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

	if err := dc.LoadFontFace("./playbutton/arial.ttf", h/10); err != nil {
		panic(err)
	}
	sw, sh := dc.MeasureString(label)

	margin := 20.0
	padding := 10.0
	rounded := 5.0
	dc.DrawRoundedRectangle(margin, h-margin-2*padding-sh, sw+padding*2, sh+padding*2, rounded)
	dc.SetRGBA(0, 0, 0, .8)
	dc.Fill()

	dc.SetRGB(1, 1, 1)
	dc.DrawString(label, margin+padding, h-margin-padding)

	return dc.Image()
}
