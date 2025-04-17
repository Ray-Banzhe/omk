package container

import (
	"os/exec"
)

func CheckDockerInstallation() bool {
	cmd := exec.Command("docker", "--version")
	// Hide command output
	cmd.Stdout = nil
	cmd.Stderr = nil
	err := cmd.Run()
	return err == nil
}

// CheckDockerComposeInstallation checks if Docker Compose is installed on the system
// It tries both standalone docker-compose and the Docker CLI plugin version
// Returns true if either version is found
func CheckDockerComposeInstallation() bool {
	// Try with traditional docker-compose command
	cmd := exec.Command("docker-compose", "--version")
	cmd.Stdout = nil
	cmd.Stderr = nil
	err := cmd.Run()

	if err == nil {
		return true
	}

	// If traditional approach fails, try with Docker CLI plugin version
	cmd = exec.Command("docker", "compose", "version")
	cmd.Stdout = nil
	cmd.Stderr = nil
	err = cmd.Run()

	return err == nil
}

func CheckDockerRunning() bool {
	cmd := exec.Command("docker", "ps")
	cmd.Stdout = nil
	cmd.Stderr = nil
	err := cmd.Run()
	return err == nil
}
