"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Papa from "papaparse";

type Household = {
  hshd_num: string;
  l: string;
  age_range: string;
  marital: string;
  income_range: string;
  homeowner: string;
  hshd_composition: string;
  hh_size: string;
  children: string;
};

type Product = {
  product_num: string;
  department: string;
  commodity: string;
  brand_ty: string;
  natural_organic_flag: string;
};

type Transaction = {
  basket_num: string;
  hshd_num: string;
  purchase_: string;
  product_num: string;
  spend: string;
  units: string;
  store_r: string;
  week_num: string;
  year: string;
};

type AppContextType = {
  households: Household[];
  products: Product[];
  transactions: Transaction[];
  setHouseholds: (data: Household[]) => void;
  setProducts: (data: Product[]) => void;
  setTransactions: (data: Transaction[]) => void;
  loading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load default data from API
    async function fetchDefaults() {
      try {
        const res = await fetch("/api/data");
        const json = await res.json();

        // Helper to convert lowercase Postgres keys to uppercase CSV headers
        // We also trim string values because raw RDS imports might contain trailing spaces
        const toUpperCaseKeys = (arr: any[]) => arr.map(obj => {
          const upperObj: any = {};
          for (const [key, value] of Object.entries(obj)) {
            upperObj[key.toUpperCase()] = typeof value === 'string' ? value.trim() : value;
          }
          return upperObj;
        });

        // Check if data is coming from RDS directly (JSON arrays)
        if (json.households && Array.isArray(json.households)) {
          setHouseholds(toUpperCaseKeys(json.households));
          setProducts(toUpperCaseKeys(json.products || []));
          setTransactions(toUpperCaseKeys(json.transactions || []));
        }
        // Fallback for CSV text logic
        else if (json.householdsText) {
          const hh = Papa.parse<Household>(json.householdsText, { header: true, skipEmptyLines: true }).data;
          setHouseholds(hh.map(row => {
            // Trim keys and values
            const cleanRow: any = {};
            for (const [key, val] of Object.entries(row)) {
              cleanRow[key.trim()] = val ? val.trim() : val;
            }
            return cleanRow;
          }));
        }

        if (!json.households && json.productsText) {
          const pr = Papa.parse<Product>(json.productsText, { header: true, skipEmptyLines: true }).data;
          setProducts(pr.map(row => {
            const cleanRow: any = {};
            for (const [key, val] of Object.entries(row)) {
              cleanRow[key.trim()] = val ? val.trim() : val;
            }
            return cleanRow;
          }));
        }

        if (!json.households && json.transactionsText) {
          const tr = Papa.parse<Transaction>(json.transactionsText, { header: true, skipEmptyLines: true }).data;
          setTransactions(tr.map(row => {
            const cleanRow: any = {};
            for (const [key, val] of Object.entries(row)) {
              cleanRow[key.trim()] = val ? val.trim() : val;
            }
            return cleanRow;
          }));
        }
      } catch (e) {
        console.error("Failed to load default data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDefaults();
  }, []);

  return (
    <AppContext.Provider
      value={{
        households,
        products,
        transactions,
        setHouseholds,
        setProducts,
        setTransactions,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useStore() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
