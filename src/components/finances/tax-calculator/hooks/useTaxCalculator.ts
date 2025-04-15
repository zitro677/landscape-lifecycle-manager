
import { useState, useEffect } from 'react';

export interface TaxExpenses {
  materials: number;
  equipment: number;
  labor: number;
  mileage: number;
  utilities: number;
  insurance: number;
  marketing: number;
  maintenance: number;
  office: number;
  other: number;
}

export interface TaxResults {
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  estimatedTax: number;
  effectiveTaxRate: number;
}

export const useTaxCalculator = () => {
  const [income, setIncome] = useState(150000);
  const [expenses, setExpenses] = useState<TaxExpenses>({
    materials: 30000,
    equipment: 15000,
    labor: 40000,
    mileage: 2500,
    utilities: 3600,
    insurance: 4800,
    marketing: 2000,
    maintenance: 3000,
    office: 1500,
    other: 1000,
  });
  const [taxRate, setTaxRate] = useState(25);
  const [filingStatus, setFilingStatus] = useState("single");
  const [taxResults, setTaxResults] = useState<TaxResults>({
    totalIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    effectiveTaxRate: 0,
  });
  const [yearFilter, setYearFilter] = useState<string>("2025");

  useEffect(() => {
    const totalExpenses = Object.values(expenses).reduce(
      (sum, expense) => sum + expense,
      0
    );
    const taxableIncome = Math.max(0, income - totalExpenses);
    const estimatedTax = (taxableIncome * taxRate) / 100;
    const effectiveTaxRate = income > 0 ? (estimatedTax / income) * 100 : 0;

    setTaxResults({
      totalIncome: income,
      totalDeductions: totalExpenses,
      taxableIncome,
      estimatedTax,
      effectiveTaxRate,
    });
  }, [income, expenses, taxRate, filingStatus, yearFilter]);

  const handleExpenseChange = (category: keyof TaxExpenses, value: string) => {
    setExpenses({
      ...expenses,
      [category]: parseFloat(value) || 0,
    });
  };

  return {
    income,
    setIncome,
    expenses,
    handleExpenseChange,
    taxRate,
    setTaxRate,
    filingStatus,
    setFilingStatus,
    taxResults,
    yearFilter,
    setYearFilter,
  };
};
