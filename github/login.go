package github

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/google/go-github/v71/github"
	"github.com/ray-d-song/omk/utils"
	"golang.org/x/oauth2"
)

type GitHubConfig struct {
	Token string `json:"token"`
}

func saveGitHubConfig(config GitHubConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}
	return os.WriteFile(utils.GetGitHubConfigFile(), data, 0644)
}

// read github config from file
func loadGitHubConfig() (GitHubConfig, error) {
	var config GitHubConfig
	configFile := utils.GetGitHubConfigFile()

	// check if file exists
	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		// if not exists, login first
		return config, saveGitHubConfig(config)
	}

	// read and parse config file
	data, err := os.ReadFile(configFile)
	if err != nil {
		return config, err
	}

	if len(data) == 0 {
		return config, nil
	}

	err = json.Unmarshal(data, &config)
	return config, err
}

// create a authenticated github client
func newAuthenticatedClient(token string) *github.Client {
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(ctx, ts)
	return github.NewClient(tc)
}

// Login handle github login process, get and save token
func Login() {
	fmt.Println("Please visit https://github.com/settings/tokens to create a personal access token with the following permissions:")
	fmt.Println("- Repository (for access to repositories)")
	fmt.Println("- ")

	var token string
	fmt.Print("Please input your GitHub personal access token: ")
	fmt.Scanln(&token)

	// check if token is valid
	client := newAuthenticatedClient(token)
	ctx := context.Background()

	// try to get user info to validate token
	user, resp, err := client.Users.Get(ctx, "")
	if err != nil || resp.StatusCode != http.StatusOK {
		fmt.Println("Invalid token, please check and try again")
		return
	}

	// save token to config file
	config := GitHubConfig{Token: token}
	if err := saveGitHubConfig(config); err != nil {
		fmt.Printf("Failed to save config: %v\n", err)
		return
	}

	fmt.Printf("You have successfully logged in as %s\n", *user.Login)
}

// CheckToken check if there is a valid github token
func CheckToken() bool {
	config, err := loadGitHubConfig()
	if err != nil {
		return false
	}

	// check if token exists
	if config.Token == "" {
		return false
	}

	return true
}

// CheckLogin check if the current token is valid
func CheckLogin() bool {
	config, err := loadGitHubConfig()
	if err != nil {
		return false
	}

	// check if token exists
	if config.Token == "" {
		return false
	}

	// check if token is valid
	client := newAuthenticatedClient(config.Token)
	ctx := context.Background()

	// try to get user info to validate token
	_, resp, err := client.Users.Get(ctx, "")
	if err != nil || resp.StatusCode != http.StatusOK {
		return false
	}

	return true
}
