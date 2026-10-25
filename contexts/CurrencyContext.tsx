"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "USD" | "LBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  exchangeRate: number; // USD to LBP rate
  convertPrice: (usdPrice: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Default exchange rate (can be updated from API or manual input)
const DEFAULT_EXCHANGE_RATE = 89500; // 1 USD = 89,500 LBP (example rate)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);

  useEffect(() => {
    // Load currency preference from localStorage
    const savedCurrency = localStorage.getItem("currency") as Currency;
    if (savedCurrency && ["USD", "LBP"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }

    // Load exchange rate from localStorage or use default
    const savedRate = localStorage.getItem("exchangeRate");
    if (savedRate) {
      setExchangeRate(parseFloat(savedRate));
    }

    // TODO: Fetch live exchange rate from API
    // fetchExchangeRate();
  }, []);

  // Persist only explicit changes, so the initial default never overwrites the saved choice
  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("currency", curr);
  };

  const convertPrice = (usdPrice: number): number => {
    if (currency === "USD") return usdPrice;
    return Math.round(usdPrice * exchangeRate);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}


