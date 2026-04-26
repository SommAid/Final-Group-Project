"use client";

import { useMemo } from "react";
import { useStore } from "@/components/StoreProvider";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ChurnPredictionPage() {
  const { transactions, loading } = useStore();

  const churnData = useMemo(() => {
    if (!transactions.length) return [];

    // Calculate Recency, Frequency, Monetary per Household
    const hshdStats: Record<string, { lastPurchaseDate: Date; frequency: number; totalSpend: number }> = {};
    let maxDate = new Date(0);

    transactions.forEach((t) => {
      if (!t.purchase_ || !t.spend) return;
      
      const date = new Date(t.purchase_);
      if (isNaN(date.getTime())) return;
      
      if (date > maxDate) maxDate = date;

      if (!hshdStats[t.hshd_num]) {
        hshdStats[t.hshd_num] = { lastPurchaseDate: date, frequency: 0, totalSpend: 0 };
      }

      const stats = hshdStats[t.hshd_num];
      if (date > stats.lastPurchaseDate) {
        stats.lastPurchaseDate = date;
      }
      stats.frequency += 1;
      stats.totalSpend += parseFloat(t.spend || "0");
    });

    return Object.entries(hshdStats).map(([hshdNum, stats]) => {
      const recencyDays = Math.floor((maxDate.getTime() - stats.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let isAtRisk = false;
      isAtRisk = recencyDays > 90;
      
      return {
        hshdNum,
        recency: recencyDays,
        frequency: stats.frequency,
        monetary: stats.totalSpend,
        isAtRisk,
      };
    });
  }, [transactions]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-xl text-zinc-500 animate-pulse">Loading churn analysis data...</p>
      </div>
    );
  }

  const atRiskCount = churnData.filter(d => d.isAtRisk).length;

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Churn Prediction Analysis</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Which customers are at risk of disengaging, and how can retention strategies address this?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="modelSelect" className="text-sm font-medium">Predictor Model:</label>
          Linear Regression
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
           <CardContent className="pt-6">
             <h3 className="text-sm font-medium text-zinc-500">Total Households Analyzed</h3>
             <p className="text-3xl font-bold mt-2">{churnData.length}</p>
           </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20 dark:border-red-900/50">
           <CardContent className="pt-6">
             <h3 className="text-sm font-medium text-red-600 dark:text-red-400">At-Risk Households</h3>
             <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{atRiskCount}</p>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-6">
             <h3 className="text-sm font-medium text-zinc-500">Average Recency (Days)</h3>
             <p className="text-3xl font-bold mt-2">
               {churnData.length ? Math.round(churnData.reduce((acc, curr) => acc + curr.recency, 0) / churnData.length) : 0}
             </p>
           </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Graphical Correlation: Recency vs. Total Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The scatter plot correlates <strong>Recency</strong> (days since last purchase) with <strong>Monetary Value</strong> (Total Spend). 
              Households colored in red are &quot;At Risk&quot; of churning wich is predicted with a &quot;Linear Regression&quot; model.
            </p>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  type="number" 
                  dataKey="recency" 
                  name="Recency (Days)" 
                  label={{ value: 'Days Since Last Purchase', position: 'bottom' }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="monetary" 
                  name="Total Spend ($)" 
                  label={{ value: 'Total Spend ($)', angle: -90, position: 'left' }} 
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Households" data={churnData} fill="#8884d8">
                  {churnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isAtRisk ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
