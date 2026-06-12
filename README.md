# AWS Infrastructure Automation with Terraform & Jenkins CI/CD

An automated DevOps solution featuring reusable Terraform modules for multi-environment AWS provisioning and an automated, polling-driven Jenkins CI/CD pipeline for containerized application deployments.
---

## 🚀 Key Features

*   **Reusable Terraform Modules**: Provisions multi-environment AWS resources (`dev` and `staging`).
*   **Rapid Environment Setup**: Reduces manual environment creation time from hours to under 15 minutes.
*   **Zero-Touch Deployment**: Automates the build, test, and deployment workflows seamlessly on every code push.
*   **Event-Driven Pipeline**: Fully integrated using Jenkins pipelines and GitHub webhooks.

---

## 🛠️ Infrastructure as Code (IaC) Setup

### 1. Prerequisites
*   Terraform installed locally.
*   AWS CLI configured with appropriate credentials to provision infrastructure.

### 2. Deployment Steps
1. Navigate to the project directory containing your Terraform files.
2. Initialize the backend and providers:
   ```bash
   terraform init
   ```
3. Target your specific environment workspace (e.g., `dev` or `staging`):
   ```bash
   terraform workspace select dev || terraform workspace new dev
   ```
4. Generate and review the execution plan:
   ```bash
   terraform plan
   ```
5. Apply the configuration to provision the AWS environment:
   ```bash
   terraform apply --auto-approve
   ```

---

## Jenkins & Local Deployment Configuration

### 1. Jenkins Server Preparation
1. Ensure your Jenkins server has the necessary plugins installed (**Terraform Plugin**).
2. Configure AWS credentials and repository access credentials within Jenkins' global security settings.
3. Ensure Docker is installed on the Jenkins host machine and the `jenkins` user has permissions to run Docker commands.

### 2. Pipeline Configuration
1. Create a new **Pipeline** job in Jenkins.
2. Scroll to the **Build Triggers** section and check the box for **Poll SCM**.
3. Set the **Schedule** cron expression to check for new code updates every 60 seconds:
   ```text
   * * * * *
   ```
4. Point the pipeline definition to retrieve your script configuration directly from your source control repository (SCM tracking).
5. Save the configuration.

---

## 🔄 Verification
1. Push a new code commit to your tracking branch on GitHub.
2. Verify that the GitHub Webhook instantly sends a payload trigger to Jenkins.
3. Observe the Jenkins dashboard to confirm the automated build, test, and deployment steps execute without manual intervention.
