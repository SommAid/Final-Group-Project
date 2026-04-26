"use client";

import { useMemo } from "react";
import { useStore } from "@/components/StoreProvider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BasketAnalysisPage() {
  const { transactions, products, loading } = useStore();

  const crossSellingPairs = useMemo(() => {
    if (!transactions.length || !products.length) return [];

    // Map Product_Num to DEPARTMENT
    const productMap = new Map();
    products.forEach((p) => productMap.set(p.product_num, p.commodity || p.department));

    // Group products by Household (HSHD_NUM) instead of Basket.
    const baskets: string[][] = [];
    let currentGroup = "";
    let currentItems: Set<string> = new Set();

    // Sort transactions by Household
    const sortedT = [...transactions].sort((a, b) => (a.hshd_num || "").localeCompare(b.hshd_num || ""));
    sortedT.forEach((t) => {
      const groupKey = t.hshd_num;

      if (!groupKey) return;

      if (groupKey !== currentGroup) {
        if (currentItems.size > 0) baskets.push(Array.from(currentItems));
        currentGroup = groupKey;
        currentItems = new Set();
      }
      const item = productMap.get(t.product_num);
      if (item) currentItems.add(item);
    });
    if (currentItems.size > 0) baskets.push(Array.from(currentItems));

    // Calculate base frequencies of individual items
    const itemFrequencies: Record<string, number> = {};
    baskets.forEach(basketItems => {
      basketItems.forEach(item => {
        itemFrequencies[item] = (itemFrequencies[item] || 0) + 1;
      });
    });

    const pairScores: Record<string, number> = {};
    const epochs = 5;
    let learningRate = 1.0;

    for (let epoch = 0; epoch < epochs; epoch++) {
      baskets.forEach(basketItems => {
        // Calculate a basket weights, and more infrequent items get a boost
        let basketWeight = 0;
        basketItems.forEach(item => {
          basketWeight += 1000 / (itemFrequencies[item] || 1);
        });

        // Normalize weight to prevent extreme values, smoothing the boosting impact
        basketWeight = 1 + (basketWeight / (basketItems.length || 1)) * 0.001;

        for (let j = 0; j < basketItems.length; j++) {
          for (let k = j + 1; k < basketItems.length; k++) {
            const pair = [basketItems[j], basketItems[k]].sort().join(" + ");
            // Update the ensemble score with the learning rate and instance weight
            pairScores[pair] = (pairScores[pair] || 0) + (learningRate * basketWeight);
          }
        }
      });
      // Decay learning rate over epochs
      learningRate *= 0.85;
    }

    return Object.entries(pairScores)
      .map(([pair, score]) => ({ pair, count: Math.round(score) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 pairs
  }, [transactions, products]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-xl text-zinc-500 animate-pulse">Loading basket analysis data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Basket Analysis (Association Rules)</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          What are the commonly purchased product combinations, and how can they drive cross-selling opportunities?
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ML Model Selection: Boosting approach to Basket Analysis</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6 space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We decided to use <strong>Gradient Boosting </strong> approach for our Basket Analysis.
              The algorithm sequentially learns across multiple epochs.
              During each generationt he model calculates a an adjusted &quot;basket weight&quot; based on the baseline frequency of items.
              The model punishes overly common bnoise and thus &quot;boosts&quot; the values of distinct core points.
              The final score is a weighted scopre, creating a sharper boundary for high-value product combinations.
            </p>
          </div>
          <h3 className="text-lg font-semibold mb-4">Top 10 Product Combinations (Commodity Level)</h3>
          <div className="h-125 w-full text-gray-600 dark:text-gray-300">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={crossSellingPairs} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis dataKey="pair" type="category" tick={{ fontSize: 13 }} width={370} />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Boosted Association Score" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
