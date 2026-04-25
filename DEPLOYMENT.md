# Deployment Guide

This guide outlines the steps to deploy the Retail Analytics Next.js application to both AWS and Microsoft Azure.

## Deployment on Azure (Recommended for Least-Cost Option)

Azure offers several ways to host a Next.js application. The easiest and most cost-effective method is using **Azure Static Web Apps** or **Azure App Service**.

### Option 1: Azure Static Web Apps (Free Tier Available)
1. **Push to GitHub**: Commit and push your code to a GitHub repository.
2. **Create Static Web App**:
   - Go to the Azure Portal and search for "Static Web Apps".
   - Click "Create".
   - Select your Subscription and Resource Group.
   - Provide a Name for your app and select a Region.
   - Under "Hosting plan type", select **Free**.
3. **Deployment Details**:
   - Select "GitHub" as the source and sign in.
   - Choose your Organization, Repository, and Branch.
   - Under "Build Presets", select **Next.js**.
   - Set the App location to `/` and leave the rest as default.
4. **Deploy**: Click "Review + create", then "Create". Azure will automatically set up a GitHub Actions workflow to build and deploy your Next.js app.

### Option 2: Azure App Service (Web App)
1. **Create Web App**:
   - Go to the Azure Portal and search for "App Services".
   - Click "Create" -> "Web App".
   - Select your Subscription and Resource Group.
   - Choose a Name for your app.
   - Publish: **Code**. Runtime stack: **Node 18 LTS** (or 20 LTS).
   - Operating System: **Linux**.
   - Pricing Plan: Choose the **F1 (Free)** or **B1 (Basic)** tier depending on your needs.
2. **Deploy via VS Code or CLI**:
   - You can use the Azure App Service extension in VS Code to deploy directly, or use the Azure CLI (`az webapp up --sku F1 --name <your-app-name>`).

### Datastore Note:
For the Azure datastore requirement, you can create an **Azure Storage Account** (Blob Storage) or an **Azure SQL Database** (Serverless/Basic tier) to host the CSVs or relational tables. In this Next.js app, data can be fetched from Azure Blob Storage via API routes or loaded interactively via the "Load Data" UI.

---

## Deployment on AWS

AWS provides robust infrastructure for hosting Next.js applications, primarily using **AWS Amplify** or **Amazon EC2/ECS**.

### Option 1: AWS Amplify (Easiest & Native Next.js Support)
1. **Push to Git**: Ensure your code is hosted on GitHub, GitLab, or Bitbucket.
2. **Connect to Amplify**:
   - Log in to the AWS Management Console and navigate to **AWS Amplify**.
   - Click "New app" -> "Host web app".
   - Select your Git provider (e.g., GitHub) and authorize AWS.
   - Select your repository and branch.
3. **Configure Build Settings**:
   - Amplify will automatically detect the Next.js framework and configure the build settings (`amplify.yml`).
   - Ensure the build command is `npm run build` and the start command is `npm start`.
4. **Deploy**:
   - Save and deploy. Amplify will provision the necessary resources (CloudFront, Lambda for server-side rendering, S3 for static assets) and deploy your app.

### Option 2: AWS Elastic Beanstalk / EC2 (Full Control)
1. **Provision EC2 Instance**:
   - Launch an EC2 instance (e.g., Ubuntu or Amazon Linux 2) using the free tier (`t2.micro`).
   - Configure Security Groups to allow inbound traffic on HTTP (80), HTTPS (443), and SSH (22).
2. **Setup Server**:
   - SSH into the instance.
   - Install Node.js and npm.
   - Clone your repository.
   - Run `npm install` and `npm run build`.
3. **Run Application**:
   - Use a process manager like `pm2` (`pm2 start npm --name "next-app" -- start`) to keep the app running.
   - Configure a reverse proxy like Nginx to route port 80 traffic to your Next.js app running on port 3000.
