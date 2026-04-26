"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/components/StoreProvider";
import { Search } from "lucide-react";

export default function DataPullPage() {
  const { transactions, households, products, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const availableHouseholds = useMemo(() => {
    if (!transactions.length) return [];
    const unique = new Set<string>();
    transactions.forEach(t => {
      if (t.HSHD_NUM) unique.add(t.HSHD_NUM);
    });
    return Array.from(unique).sort();
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return [];

    const searchNum = searchTerm.trim().padStart(4, '0');

    // Create maps for quick lookup
    const productMap = new Map();
    products.forEach(p => productMap.set(p.PRODUCT_NUM, p));

    const result = transactions
      .filter(t => t.HSHD_NUM === searchNum)
      .map(t => {
        const prod = productMap.get(t.PRODUCT_NUM);
        return {
          HSHD_NUM: t.HSHD_NUM,
          BASKET_NUM: t.BASKET_NUM,
          DATE: t.PURCHASE_,
          PRODUCT_NUM: t.PRODUCT_NUM,
          DEPARTMENT: prod?.DEPARTMENT || "Unknown",
          COMMODITY: prod?.COMMODITY || "Unknown",
        };
      });

    // Sort by Hshd_num, Basket_num, Date, Product_num, Department, Commodity
    result.sort((a, b) => {
      if (a.HSHD_NUM !== b.HSHD_NUM) return a.HSHD_NUM.localeCompare(b.HSHD_NUM);
      if (a.BASKET_NUM !== b.BASKET_NUM) return a.BASKET_NUM.localeCompare(b.BASKET_NUM);
      if (a.DATE !== b.DATE) return (a.DATE || "").localeCompare(b.DATE || "");
      if (a.PRODUCT_NUM !== b.PRODUCT_NUM) return a.PRODUCT_NUM.localeCompare(b.PRODUCT_NUM);
      if (a.DEPARTMENT !== b.DEPARTMENT) return a.DEPARTMENT.localeCompare(b.DEPARTMENT);
      return a.COMMODITY.localeCompare(b.COMMODITY);
    });

    return result;
  }, [searchTerm, transactions, products]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <p className="text-xl text-zinc-500 animate-pulse">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interactive Data Pull</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Search for Data Pulls based on Hshd_num
        </p>
      </div>

      <div className="flex flex-col max-w-3xl space-y-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search HSHD_NUM (e.g. 0010)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex h-10 w-full rounded-md border border-zinc-300 bg-transparent pl-9 pr-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-700 dark:focus:ring-zinc-800 dark:focus:ring-offset-zinc-900"
          />
        </div>

        {availableHouseholds.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Available Households (Click to search)
            </p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              {availableHouseholds.map(num => (
                <button
                  key={num}
                  onClick={() => setSearchTerm(num)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${searchTerm === num
                      ? "bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/40 dark:text-blue-100 dark:border-blue-800"
                      : "bg-white border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-300"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Hshd_num</th>
                <th className="px-6 py-3 font-medium">Basket_num</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Product_num</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Commodity</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr key={i} className="border-b dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="px-6 py-4">{row.HSHD_NUM}</td>
                    <td className="px-6 py-4">{row.BASKET_NUM}</td>
                    <td className="px-6 py-4">{row.DATE}</td>
                    <td className="px-6 py-4">{row.PRODUCT_NUM}</td>
                    <td className="px-6 py-4">{row.DEPARTMENT}</td>
                    <td className="px-6 py-4">{row.COMMODITY}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    {searchTerm ? "No results found for this Household Number." : "Enter a Household Number to view data pull."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
