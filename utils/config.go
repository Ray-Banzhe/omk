package utils

type Step = string

// currently use a json file to store the config
// Maybe in the future, I will use sqlite instead

const (
	StepAppName Step = "app_name"
	StepAppDesc Step = "app_desc"
	StepBuild   Step = "build"
	StepDeploy  Step = "deploy"
	StepWebhook Step = "webhook"
)

type AppConfig struct {
	Description string `json:"description"`
	URL         string `json:"url"`
	// docker or docker-compose
	BuildType string `json:"build_type"`
	// success unknown failed
	WebhookStatus string `json:"webhook_status"`
	// record the last failed step
	LastFailedStep string `json:"last_failed_step"`
	// record the last container status
	LastContainerStatus string `json:"last_container_status"`
	Branch              string `json:"branch"`
}

// name - config
type AppConfigMap map[string]AppConfig
