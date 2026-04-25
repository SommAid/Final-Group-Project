"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
import Papa from "papaparse";
import { Upload } from "lucide-react";

export default function LoadDataPage() {
  const { setHouseholds, setProducts, setTransactions } = useStore();
  const [status, setStatus] = useState<string>("");

  const handleFileUpload = (type: "households" | "products" | "transactions") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(`Loading ${type}...`);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = results.data.map((row: any) => {
          const cleanRow: any = {};
          for (const [key, val] of Object.entries(row)) {
            cleanRow[key.trim()] = val ? (val as string).trim() : val;
          }
          return cleanRow;
        });

        if (type === "households") setHouseholds(cleanedData as any);
        if (type === "products") setProducts(cleanedData as any);
        if (type === "transactions") setTransactions(cleanedData as any);

        setStatus(`Successfully loaded ${type}!`);
        setTimeout(() => setStatus(""), 3000);
      },
      error: (error) => {
        setStatus(`Error loading ${type}: ${error.message}`);
      }
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Loading Web App</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Upload latest CSV files to update the application&apos;s local datastore.
        </p>
      </div>

      {status && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          {status}
        </div>
      )}

      <div className="space-y-6">
        {/* Households */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Households Data</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload 400_households.csv</p>
            </div>
            <div>
              <label className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90">
                Choose File
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload("households")} />
              </label>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Products Data</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload 400_products.csv</p>
            </div>
            <div>
              <label className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90">
                Choose File
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload("products")} />
              </label>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 dark:border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Transactions Data</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload 400_transactions.csv</p>
            </div>
            <div>
              <label className="cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90">
                Choose File
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload("transactions")} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
