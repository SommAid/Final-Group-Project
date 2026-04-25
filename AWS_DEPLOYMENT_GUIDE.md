# AWS Full Deployment Guide

This guide provides a comprehensive outline for deploying your Next.js Retail Analytics application to AWS, setting up a real authentication web server, hosting your retail datasets in an AWS database, and connecting your application to fetch data dynamically.

---

## Phase 1: Deploying the Application & Web Server Setup (Authentication)

To deploy your application and secure it with a real "Web Server Setup" (Username, Password, Email), we will use **AWS Amplify** and **Amazon Cognito**.

### Step 1: Set up AWS Amplify (Hosting)
AWS Amplify is the fastest way to deploy a Next.js application on AWS.
1. **Source Control:** Push your Next.js project to a Git repository (GitHub, GitLab, or Bitbucket).
2. **Amplify Console:** Log into the AWS Console and navigate to **AWS Amplify**.
3. **Deploy:** Click "New app" -> "Host web app". Connect your repository and select your main branch.
4. **Build Settings:** Amplify automatically detects Next.js. Leave the default build settings (`npm run build`) and click Save and Deploy. Your app is now live on an `amplifyapp.com` domain.

### Step 2: Implement Amazon Cognito (Authentication)
Currently, the `/login` page is a visual mock. We will replace it with actual authentication.
1. **Create User Pool:** In the AWS Console, navigate to **Amazon Cognito** and create a new **User Pool**.
2. **Sign-in Options:** Choose Email and/or Username as the sign-in options. Configure password policies as needed.
3. **App Client:** Create an App Client (without a client secret, as this is a frontend web app).
4. **Integration:** 
   - Install the AWS Amplify library in your project: `npm install aws-amplify`
   - Configure Amplify in your `app/layout.tsx` using your User Pool ID and Client ID.
   - Update `app/login/page.tsx` to use the `signIn` and `signUp` methods from the `aws-amplify/auth` library to authenticate users against your Cognito User Pool.

---

## Phase 2: Hosting the Data on AWS Database

To move away from local CSV files, we will import the Transactions, Households, and Products data into a managed relational database: **Amazon RDS (PostgreSQL)**.

### Step 1: Provision the Database
1. **Create RDS Instance:** In the AWS Console, navigate to **RDS** and click "Create database".
2. **Engine:** Select **PostgreSQL**.
3. **Templates:** Choose the "Free tier" or "Dev/Test" template.
4. **Credentials:** Set your Master Username and Master Password. Keep these secure.
5. **Network:** Ensure the VPC Security Group allows inbound traffic on port 5432 from your application's IP (or allow public access if developing locally, though restricting to your IP is safer).

### Step 2: Upload Data to the Database
1. **Connect:** Use a database client (like DBeaver, pgAdmin, or DataGrip) to connect to your RDS endpoint using the master credentials.
2. **Create Tables:** Execute SQL scripts to create tables for `households`, `products`, and `transactions` matching the schemas of your CSV files.
3. **Import Data:** Use your database client's import tool or the PostgreSQL `COPY` command to upload `400_households.csv`, `400_products.csv`, and `400_transactions.csv` into their respective tables.

---

## Phase 3: Connecting the Application to AWS RDS

Now that your data is in RDS, you need to allow your Next.js application to query it securely.

### Step 1: Install Database Driver
1. Run `npm install pg` in your project to install the Node.js PostgreSQL client.

### Step 2: Set Environment Variables
1. In your local project, create a `.env.local` file (do not commit this to Git).
2. Add your RDS connection string:
   ```env
   DATABASE_URL=postgresql://<master_username>:<master_password>@<rds_endpoint>:5432/<database_name>
   ```
3. Add this same environment variable in the **AWS Amplify Console** under your App's "Environment variables" settings for the deployed version.

---

## Phase 4: Refactoring the Code to Pull from AWS DB

To transition from the local CSVs to the live AWS database, you will refactor the application's data fetching layer.

### Step 1: Create a Database Utility File
Create a new file `lib/db.ts` to manage the database connection pool:
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for RDS
});

export default pool;
```

### Step 2: Refactor the Next.js API Route
Update `app/api/data/route.ts` to fetch from PostgreSQL instead of the local filesystem.
```typescript
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Query the RDS database
    const householdsResult = await pool.query('SELECT * FROM households LIMIT 1000');
    const productsResult = await pool.query('SELECT * FROM products LIMIT 1000');
    const transactionsResult = await pool.query('SELECT * FROM transactions LIMIT 5000');

    // Return JSON
    return NextResponse.json({
      households: householdsResult.rows,
      products: productsResult.rows,
      transactions: transactionsResult.rows
    });
  } catch (error) {
    console.error("DB Error", error);
    return NextResponse.json({ error: 'Failed to fetch from RDS' }, { status: 500 });
  }
}
```

### Step 3: Update the StoreProvider Context
Update `components/StoreProvider.tsx` so it no longer parses CSV text via `Papa.parse`. Instead, it will directly set the JSON objects returned by your new API route.
```typescript
// Inside StoreProvider.tsx fetchDefaults()
const res = await fetch("/api/data");
const json = await res.json();

if (json.households) setHouseholds(json.households);
if (json.products) setProducts(json.products);
if (json.transactions) setTransactions(json.transactions);
```

### Summary of Changes:
By following these steps, you will transform the prototype into a production-ready architecture. **AWS Amplify** will host the frontend, **Amazon Cognito** will secure the login page, and **Amazon RDS** will serve the data dynamically, entirely removing the reliance on local, static CSV files.
