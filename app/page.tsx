"use client";

import { useStore } from "@/components/StoreProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const { households, transactions, products, loading } = useStore();

  const spendByDepartment = useMemo(() => {
    if (!transactions.length || !products.length) return [];
    
    const productMap = new Map();
    products.forEach(p => productMap.set(p.PRODUCT_NUM, p.DEPARTMENT));

    const spendMap: Record<string, number> = {};
    transactions.forEach(t => {
      const dept = productMap.get(t.PRODUCT_NUM);
      spendMap[dept] = (spendMap[dept] || 0) + parseFloat(t.SPEND || "0");
    });

    return Object.entries(spendMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [transactions, products]);

  const spendByWeek = useMemo(() => {
    if (!transactions.length) return [];
    
    const spendMap: Record<string, number> = {};
    transactions.forEach(t => {
      const week = t.WEEK_NUM;
      if (week) {
        spendMap[week] = (spendMap[week] || 0) + parseFloat(t.SPEND || "0");
      }
    });

    return Object.entries(spendMap)
      .map(([name, value]) => ({ name: parseInt(name), value }))
      .sort((a, b) => a.name - b.name);
  }, [transactions]);

  const spendByHouseholdSize = useMemo(() => {
    if (!transactions.length || !households.length) return [];

    const hshdMap = new Map();
    households.forEach(h => hshdMap.set(h.HSHD_NUM, h.HH_SIZE));

    const spendMap: Record<string, number> = {};
    transactions.forEach(t => {
      const size = hshdMap.get(t.HSHD_NUM) || "Unknown";
      spendMap[size] = (spendMap[size] || 0) + parseFloat(t.SPEND || "0");
    });

    return Object.entries(spendMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, households]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-xl text-zinc-500 animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retail Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Overview of customer engagement, temporal trends, and demographic impacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time (Spend by Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 text-gray-600">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={spendByWeek}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Total Spend ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Departments by Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 text-gray-600">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={spendByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#00C49F" name="Total Spend ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend by Household Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 text-gray-600">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    data={spendByHouseholdSize}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {spendByHouseholdSize.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
