# Custom Node.js CI/CD Server (Prototype)

🚀 A lightweight, custom-built CI/CD system designed for small-to-medium Node.js projects. This system automates deployments from GitHub to AWS EC2 using webhooks and SSH.

> [!NOTE]
> This project is currently a **Prototype**. We are actively refining the deployment scripts and security measures.

## 🏗️ Architecture Overview

The system operates across **two AWS EC2 instances** and manages **three repositories**:

### 1. The EC2 Instances
- **CI/CD Server (TC2):** The "Brains". It listens for GitHub webhooks, verifies signatures, and triggers the deployment scripts on the target server.
- **Deploy Server (Target):** The "Muscle". This is where your actual applications (Frontend & Backend) live and run under PM2.

### 2. The Repositories
- **CI/CD Server Repo:** Contains the Node.js Express server that manages the workflow.
- **Frontend Repo:** Your web application frontend.
- **Backend Repo:** Your Node.js API/Backend.

## 🔄 The Workflow

1.  **Code Push:** You push code to the `main` branch of your Frontend or Backend repo.
2.  **Webhook Trigger:** GitHub sends a signed POST request to your CI/CD Server.
3.  **Validation:** The CI/CD server verifies the `x-hub-signature-256` using a secret key.
4.  **Telegram Alert:** You get an instant notification: 🚀 *Deployment Started*.
5.  **Remote Execution:** The CI/CD server connects to the **Deploy Server** via SSH.
6.  **Optimized Deployment:**
    - The server pulls the latest code.
    - It checks if `package-lock.json` changed.
    - If needed, it runs `npm ci` (using a **Swap File** to prevent memory crashes).
    - It reloads the app using **PM2**.
7.  **Final Update:** You get a Telegram message: ✅ *Deployment Successful*.

## 🛠️ Step-by-Step Setup

### 1. Server Preparation
- **Deploy Server (OOM Fix):** Run the swap file setup to ensure `npm ci` doesn't crash:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
  ```

### 2. SSH Authentication
- Generate a key on the **CI/CD Server**: `ssh-keygen`.
- Copy the public key (`cat ~/.ssh/id_rsa.pub`).
- Add it to the **Deploy Server's** `~/.ssh/authorized_keys`.

### 3. Webhook Configuration
- In GitHub Repo > Settings > Webhooks:
  - **Payload URL:** `http://<CICD_SERVER_IP>:3000/github-webhook/backend`
  - **Content type:** `application/json`
  - **Secret:** Your chosen `GITHUB_WEBHOOK_SECRET`.

### 4. Deployment Scripts
Ensure `~/deploy-frontend.sh` and `~/deploy-backend.sh` exist on the **Deploy Server** and have execution permissions (`chmod +x`).

---

## 📈 Future Improvements
- [ ] Multi-tenant support (multiple users/projects).
- [ ] Dashboard UI for build logs.
- [ ] Support for Docker deployments.
- [ ] Auto-rollback on failed builds.

---
*Created with ❤️ by Varun Mendre*
