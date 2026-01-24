"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ExchangeRate {
  code: string;
  rate: string;
  rate_float: number;
  name: string;
}

interface CurrencyContextType {
  rates: ExchangeRate[];
  loading: boolean;
  convertPrice: (amountInMnt: number, targetCurrency: "USD" | "KRW" | "MNT") => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("https://monxansh.appspot.com/xansh.json");
        const data = await response.json();
        setRates(data);
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const convertPrice = (amountInMnt: number, targetCurrency: "USD" | "KRW" | "MNT") => {
    if (targetCurrency === "MNT") return amountInMnt;
    if (loading || rates.length === 0) return 0;

    const rateData = rates.find((r) => r.code === targetCurrency);
    if (!rateData) return 0;

    // Logic: MNT / Rate = Target Amount
    // e.g., 3400 MNT / 3400 (USD Rate) = 1 USD
    // e.g., 2.4 MNT / 2.4 (KRW Rate) = 1 KRW (Wait, check logic)
    
    // Let's verify rate direction from the API response I saw earlier:
    // USD rate_float: 3564.01. Meaning 1 USD = 3564.01 MNT.
    // So to get USD from MNT: amountInMnt / 3564.01
    
    // KRW rate_float: 2.42. Meaning 1 KRW = 2.42 MNT.
    // So to get KRW from MNT: amountInMnt / 2.42

    return Math.round(amountInMnt / rateData.rate_float);
  };

  return (
    <CurrencyContext.Provider value={{ rates, loading, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
