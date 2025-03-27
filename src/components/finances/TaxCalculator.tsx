
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState(150000);
  const [expenses, setExpenses] = useState({
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
  const [taxResults, setTaxResults] = useState({
    totalIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    estimatedTax: 0,
    effectiveTaxRate: 0,
  });

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
  }, [income, expenses, taxRate, filingStatus]);

  const handleExpenseChange = (category: string, value: string) => {
    setExpenses({
      ...expenses,
      [category]: parseFloat(value) || 0,
    });
  };

  const pieData = [
    { name: "Materials", value: expenses.materials, color: "#0ea5e9" },
    { name: "Equipment", value: expenses.equipment, color: "#8b5cf6" },
    { name: "Labor", value: expenses.labor, color: "#10b981" },
    { name: "Mileage", value: expenses.mileage, color: "#f97316" },
    { name: "Utilities", value: expenses.utilities, color: "#f43f5e" },
    { name: "Insurance", value: expenses.insurance, color: "#a855f7" },
    { name: "Marketing", value: expenses.marketing, color: "#ec4899" },
    { name: "Maintenance", value: expenses.maintenance, color: "#6366f1" },
    { name: "Office", value: expenses.office, color: "#14b8a6" },
    { name: "Other", value: expenses.other, color: "#64748b" },
  ].filter((item) => item.value > 0);

  const taxBreakdown = [
    {
      name: "Tax Paid",
      value: taxResults.estimatedTax,
      color: "#f43f5e",
    },
    {
      name: "After-Tax Income",
      value: taxResults.totalIncome - taxResults.estimatedTax,
      color: "#10b981",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Income & Filing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="income">Annual Business Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="filing-status">Filing Status</Label>
                  <Select
                    value={filingStatus}
                    onValueChange={setFilingStatus}
                  >
                    <SelectTrigger id="filing-status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married-joint">
                        Married Filing Jointly
                      </SelectItem>
                      <SelectItem value="married-separate">
                        Married Filing Separately
                      </SelectItem>
                      <SelectItem value="head">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tax-rate">
                    Estimated Tax Rate: {taxRate}%
                  </Label>
                  <Slider
                    id="tax-rate"
                    min={0}
                    max={50}
                    step={1}
                    value={[taxRate]}
                    onValueChange={(value) => setTaxRate(value[0])}
                    className="mt-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Business Expenses & Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materials">Materials & Supplies ($)</Label>
                  <Input
                    id="materials"
                    type="number"
                    min="0"
                    value={expenses.materials}
                    onChange={(e) =>
                      handleExpenseChange("materials", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="equipment">Equipment & Depreciation ($)</Label>
                  <Input
                    id="equipment"
                    type="number"
                    min="0"
                    value={expenses.equipment}
                    onChange={(e) =>
                      handleExpenseChange("equipment", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="labor">Labor & Contractors ($)</Label>
                  <Input
                    id="labor"
                    type="number"
                    min="0"
                    value={expenses.labor}
                    onChange={(e) =>
                      handleExpenseChange("labor", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage & Vehicle Expenses ($)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={expenses.mileage}
                    onChange={(e) =>
                      handleExpenseChange("mileage", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="utilities">Utilities & Phone ($)</Label>
                  <Input
                    id="utilities"
                    type="number"
                    min="0"
                    value={expenses.utilities}
                    onChange={(e) =>
                      handleExpenseChange("utilities", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="insurance">Insurance Premiums ($)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    min="0"
                    value={expenses.insurance}
                    onChange={(e) =>
                      handleExpenseChange("insurance", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="marketing">Advertising & Marketing ($)</Label>
                  <Input
                    id="marketing"
                    type="number"
                    min="0"
                    value={expenses.marketing}
                    onChange={(e) =>
                      handleExpenseChange("marketing", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maintenance">
                    Repairs & Maintenance ($)
                  </Label>
                  <Input
                    id="maintenance"
                    type="number"
                    min="0"
                    value={expenses.maintenance}
                    onChange={(e) =>
                      handleExpenseChange("maintenance", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="office">Office Expenses ($)</Label>
                  <Input
                    id="office"
                    type="number"
                    min="0"
                    value={expenses.office}
                    onChange={(e) =>
                      handleExpenseChange("office", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="other">Other Expenses ($)</Label>
                  <Input
                    id="other"
                    type="number"
                    min="0"
                    value={expenses.other}
                    onChange={(e) =>
                      handleExpenseChange("other", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Tax Calculation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Total Income</Label>
                <p className="text-2xl font-semibold">
                  ${taxResults.totalIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Total Deductions
                </Label>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  ${taxResults.totalDeductions.toLocaleString()}
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Taxable Income</Label>
                <p className="text-2xl font-semibold">
                  ${taxResults.taxableIncome.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Estimated Tax</Label>
                <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  ${taxResults.estimatedTax.toLocaleString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Effective Tax Rate
                </Label>
                <p className="text-2xl font-semibold">
                  {taxResults.effectiveTaxRate.toFixed(1)}%
                </p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">After-Tax Income</Label>
                <p className="text-2xl font-bold">
                  $
                  {(
                    taxResults.totalIncome - taxResults.estimatedTax
                  ).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Tax Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {taxBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="w-full sm:w-auto">Generate Tax Report</Button>
      </div>
    </motion.div>
  );
};

export default TaxCalculator;
