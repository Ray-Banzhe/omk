## Omk
自托管容器 CI 平台，类似 Vercel CI 和 Pika Pod 的结合  

## 前提条件
- Docker
- Git
- Github Token (用于 fork 其他人的仓库和创建 webhook)
- 你的服务器可以被 Github 访问

## Omk 是如何工作的?
当您运行 `omk run <repo-url>` 时，Omk 会：  
1. 检查您是否已登录到 Github
2. 检查该仓库是否在您的名下：
  - 是：则继续
  - 否：询问您是否要 fork 该仓库
3. 克隆仓库到本地
4. 选择运行方式
  - Dockerfile
  - docker-compose
  - 输入你自己的构建和运行脚本
5. 部署成功后，Omk 会创建 webhook
6. 之后每次仓库更新，Omk 通过 webhook 收到通知，自动重新构建和运行

## 如何运行
```bash
omk run <repo-url>
```
选项:  
- `-n, --name <app-name>`: 应用名称
- `-b, --branch <branch>`: 指定分支
- `-d, --description <app-description>`: 应用描述
- `--dockerfile <dockerfile>`: 指定 Dockerfile 路径
- `--compose-file <compose-file>`: 指定 docker-compose.yml 路径(在包含 --dockerfile 时会被忽略)
- `--build-command <build-command>`: 指定构建命令(在包含 --dockerfile 或 --compose-file 时会被忽略)
- `--run-command <run-command>`: 指定运行命令(在包含 --dockerfile 或 --compose-file 时会被忽略)

## 其他命令
```bash
# 指定账户密码，多次执行视为覆写操作
omk account -u <username> -p <password>

# 运行web服务，需要先设定用户名和密码
omk server
```