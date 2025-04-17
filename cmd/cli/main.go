package main

import (
	"fmt"
	"net/url"
	"os"

	"github.com/ray-d-song/omk/container"
	"github.com/spf13/cobra"
)

func main() {
	// Execute the root command
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

var rootCmd = &cobra.Command{
	Use:   "omk",
	Short: "Omk - A simple application manager",
	Long:  `Omk is a simple application manager that helps you deploy and manage your applications.`,
}

var runCmd = &cobra.Command{
	Use:   "run <url>",
	Short: "Run a new application",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		// Check if the url is valid
		if !isValidURL(args[0]) {
			fmt.Println("Invalid URL")
			os.Exit(1)
		}

		// Get branch flag
		branch, _ := cmd.Flags().GetString("branch")

		fmt.Printf("Running application from URL: %s with branch: %s\n", args[0], branch)
		// TODO: Implement the actual run logic
	},
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all applications",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("Listing all applications...")
		// TODO: Implement the actual list logic
	},
}

var deleteCmd = &cobra.Command{
	Use:   "delete <name>",
	Short: "Delete an application",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Deleting application: %s\n", args[0])
		// TODO: Implement the actual delete logic
	},
}

func init() {
	if !container.CheckDockerInstallation() {
		fmt.Println("Docker is not installed")
		os.Exit(1)
	}

	if !container.CheckDockerRunning() {
		fmt.Println("Docker is not running")
		os.Exit(1)
	}
	// Add commands to root command
	rootCmd.AddCommand(runCmd)
	rootCmd.AddCommand(listCmd)
	rootCmd.AddCommand(deleteCmd)

	// Add flags to run command
	runCmd.Flags().StringP("branch", "b", "main", "Set the branch to deploy")
}

// isValidURL checks if the provided string is a valid URL
func isValidURL(str string) bool {
	_, err := url.ParseRequestURI(str)
	if err != nil {
		return false
	}

	u, err := url.Parse(str)
	if err != nil || u.Scheme == "" || u.Host == "" {
		return false
	}

	return true
}
