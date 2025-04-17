package utils

import (
	"os"
	"path"
)

func GetConfigDir() string {
	dir := path.Join(os.Getenv("HOME"), ".omk")
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}
	return dir
}

func GetConfigFile() string {
	f := path.Join(GetConfigDir(), "config.json")
	if _, err := os.Stat(f); os.IsNotExist(err) {
		os.Create(f)
	}
	return f
}

func GetAppDir() string {
	dir := path.Join(GetConfigDir(), "apps")
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}
	return dir
}

func GetAppCodeDir(appName string) string {
	return path.Join(GetAppDir(), appName)
}

func GetGitHubConfigFile() string {
	return path.Join(GetConfigDir(), "github.json")
}
