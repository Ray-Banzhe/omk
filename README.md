## Omk
Self-hosted container CI platform, similar to the combination of Vercel CI and Pika Pod

## Prerequisites
- Docker
- Git
- Github Token (for fork other's repo and create webhook)
- Your server can be accessed by Github

## How Omk works
When you run `omk run <repo-url>`, Omk will:
1. Check if you are logged in to Github
2. Check if the repo is yours:
  - Yes: continue
  - No: ask you if you want to fork the repo
3. Clone the repo to your server
4. Choose the way to run the container
  - Dockerfile
  - docker-compose
  - Input your own build and run script
5. Deploy successfully, Omk will create a webhook
6. Every time the repo is updated, Omk will receive the notification through the webhook, and automatically rebuild and run

## How to run
```bash
omk run <repo-url>
```
Options:
- `-n, --name <app-name>`: app name
- `-b, --branch <branch>`: specify the branch
- `-d, --description <app-description>`: app description
- `--dockerfile <dockerfile>`: specify the Dockerfile path
- `--compose-file <compose-file>`: specify the docker-compose.yml path
- `--build-command <build-command>`: specify the build command
- `--run-command <run-command>`: specify the run command

## Other Command
```bash
# set account, use to login to web server
omk account -u <username> -p <password>

# run web server, need account first
omk server
```