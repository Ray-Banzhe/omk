package utils

import "fmt"

type Color int

const (
	Red Color = iota + 31
	Green
	Yellow
	Blue
)

func PrintColor(str string, color Color) {
	fmt.Printf("\033[%dm%s\033[0m\n", color, str)
}
