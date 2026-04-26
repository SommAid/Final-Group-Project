[Hosted Application](https://main.d2u8p5jk4dbpcy.amplifyapp.com/)

# Retail Analytics Dashboard

A Next.js application designed for simple retail analytics and interactive data exploration. This application explores different data analytic techniques like boosting, Adagrad, linear regression, and others to find patterns in customer transaction trends. This application is intended to be luanched through Amazon Webservices (AWS). This is accomplished with Amplify, Congnito, and RDS.

## Application Architecture

This project is built using modern full-stack web technologies and is explicitly designed to be deployed seamlessly into the AWS ecosystem:
- **Frontend Framework**: Next.js (App Router) & React 19
- **Styling & UI**: Tailwind CSS, Lucide React Icons, and a custom `Card` component interface.
- **Charts & Visualization**: Recharts (Responsive data visualization)
- **Authentication**: AWS Cognito via AWS Amplify UI (`@aws-amplify/ui-react`), providing a seamless, secure login barrier that handles user sessions natively.
- **Datastore**: Amazon RDS (PostgreSQL). The application retrieves analytical data (Households, Products, Transactions) dynamically from a live SQL database via Next.js API routes (`pg` node client), eliminating the need to parse raw local CSVs.

## Project Structure

```
├── app/                      # Next.js App Router Pages
│   ├── api/data/route.ts     # Server-side API endpoint connecting to AWS RDS (Postgres)
│   ├── basket-analysis/      # Data Science: Gradient Boosting approach to product pairings
│   ├── churn-prediction/     # Data Science: RFM Scatter Plot with selectable ML model logic
│   ├── data-pull/            # Interactive Data Pull interface (Search by Hshd_num)
│   ├── load-data/            # Admin Interface: Client-side CSV uploading/parsing logic
│   ├── layout.tsx            # Global layout enforcing AWS Amplify Authentication
│   └── page.tsx              # Main Analytics Dashboard (Recharts visualizations)
├── components/               # Reusable React components
│   ├── ui/card.tsx           # Standardized structural UI elements
│   ├── AmplifyProvider.tsx   # Global AWS Amplify Auth Context Configuration
│   ├── Sidebar.tsx           # Sidebar navigation UI (includes dynamic user identity and Logout)
│   └── StoreProvider.tsx     # React Context for global state management and datastore syncing
├── lib/                      
│   └── db.ts                 # PostgreSQL database pool connection setup
├── init_db.sql               # Database initialization and raw data ingestion scripts for pgAdmin
└── AWS_DEPLOYMENT_GUIDE.md   # Step-by-step instructions for a full production AWS deployment
```

## Getting Started Locally

### 1. Prerequisites
Ensure you have Node.js installed on your machine.

### 2. Environment Variables
You must connect the application to an AWS Cognito User Pool and an AWS RDS Database for the application to function. Create a `.env.local` file at the root of the project:

```env
# AWS Cognito Identity Setup
NEXT_PUBLIC_USER_POOL_ID="us-east-1_xxxxxxxxx"
NEXT_PUBLIC_USER_POOL_CLIENT_ID="xxxxxxxxxxxxxxxxxxxxxx"

# AWS RDS PostgreSQL Connection
DATABASE_URL="postgresql://<your_username>:<your_password>@<your_rds_endpoint>:5432/postgres?sslmode=require"
```

### 3. Installation
Install the project dependencies using npm:
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. You will immediately be intercepted by the AWS Cognito login screen. Once authenticated, you will be securely routed to the Analytics Dashboard.

Authors:
Aidan Sommers & Atharv Shete
