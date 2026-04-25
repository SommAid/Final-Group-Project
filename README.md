# Retail Analytics Dashboard

A modern Next.js application that visualizes retail analytics and provides interactive data exploration, fulfilling the data science and analytics project requirements.

## Project Structure

```
├── app/                  # Next.js App Router
│   ├── api/data/         # API endpoint to load default local CSV data
│   ├── data-pull/        # Interactive Data Pull page for Hshd_num search
│   ├── load-data/        # Data Loading Web App for uploading new CSV datasets
│   ├── login/            # Web Server Setup mock login page
│   ├── layout.tsx        # Global layout with Sidebar navigation
│   └── page.tsx          # Main Dashboard with Recharts visualizations
├── components/           # Reusable React components
│   ├── Sidebar.tsx       # Sidebar navigation UI
│   └── StoreProvider.tsx # React Context for global state management of datasets
├── lib/                  # Utility functions
├── public/               # Static assets
└── DEPLOYMENT.md         # Instructions for deploying to AWS and Azure
```

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Requirements Answers

### 1. Write-Up on ML Models

**i. Linear Regression:**
A foundational statistical method that models the relationship between a dependent variable and one or more independent variables by fitting a linear equation to observed data. It is easy to interpret and computationally efficient but assumes a linear relationship, which may not capture complex patterns.

**ii. Random Forest:**
An ensemble learning method that constructs multiple decision trees during training and outputs the average prediction (for regression) or majority vote (for classification). It is highly robust to overfitting, handles non-linear relationships well, and provides feature importance metrics, making it a powerful tool for complex datasets.

**iii. Gradient Boosting:**
Another ensemble technique that builds models sequentially, with each new model attempting to correct the errors of the previous ones using gradient descent. While more prone to overfitting if not tuned properly and slower to train than Random Forests, it often yields higher predictive accuracy on complex, tabular data.

**Predictive Modeling Technique for Customer Lifetime Value (CLV):**
To predict long-term revenue potential (CLV) and prioritize high-value customers, **Gradient Boosting** (e.g., XGBoost or LightGBM) is the most effective technique. CLV prediction often involves complex, non-linear relationships between various customer features (purchase frequency, recency, average order value, demographics). Gradient Boosting excels at capturing these nuanced patterns and interactions in tabular transaction data, ultimately providing more accurate, granular revenue forecasts than Linear Regression or Random Forest, enabling highly targeted retention and marketing strategies.
