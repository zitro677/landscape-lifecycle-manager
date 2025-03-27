
import React, { useState } from "react";
import { motion } from "framer-motion";
import AnimatedPage from "../shared/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TaxCalculator from "./TaxCalculator";
import ExpenseTracker from "./ExpenseTracker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for finances
const monthlyIncomeData = [
  { name: "Jan", income: 18500, expenses: 12000 },
  { name: "Feb", income: 20100, expenses: 13500 },
  { name: "Mar", income: 19200, expenses: 13000 },
  { name: "Apr", income: 22500, expenses: 14800 },
  { name: "May", income: 25700, expenses: 16900 },
  { name: "Jun", income: 28900, expenses: 18200 },
  { name: "Jul", income: 31200, expenses: 19500 },
  { name: "Aug", income: 33800, expenses: 20700 },
  { name: "Sep", income: 30500, expenses: 19100 },
  { name: "Oct", income: 27800, expenses: 17300 },
  { name: "Nov", income: 25200, expenses: 16100 },
  { name: "Dec", income: 23800, expenses: 15200 },
];

const projectIncomeData = [
  { name: "Johnson Family", value: 2450 },
  { name: "Oakridge Community", value: 8750 },
  { name: "Peterson Residence", value: 3200 },
  { name: "Sunset Hills Park", value: 12300 },
  { name: "Martinez Garden", value: 4750 },
  { name: "Riverfront Plaza", value: 22500 },
  { name: "Meadowbrook HOA", value: 8900 },
];

const expenseBreakdownData = [
  { name: "Labor", value: 45000, color: "#0ea5e9" },
  { name: "Materials", value: 32000, color: "#8b5cf6" },
  { name: "Equipment", value: 15000, color: "#10b981" },
  { name: "Overhead", value: 10000, color: "#f97316" },
  { name: "Marketing", value: 5000, color: "#f43f5e" },
  { name: "Other", value: 3000, color: "#64748b" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

const FinancesPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>("year");
  const [yearFilter, setYearFilter] = useState<string>("2023");

  const totalIncome = monthlyIncomeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyIncomeData.reduce((sum, item) => sum + item.expenses, 0);
  const netIncome = totalIncome - totalExpenses;
  const profitMargin = ((netIncome / totalIncome) * 100).toFixed(1);

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Finances</h1>
            <p className="text-muted-foreground mt-1">
              Track income, expenses, and financial performance
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 md:mt-0 flex gap-2"
          >
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-card rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
            <p className="text-3xl font-bold mt-2">${totalIncome.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="glass-card rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <p className="text-3xl font-bold mt-2">${totalExpenses.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="glass-card rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
            <p className="text-3xl font-bold mt-2">${netIncome.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="glass-card rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
            <p className="text-3xl font-bold mt-2">{profitMargin}%</p>
            <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
          </motion.div>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
            <TabsTrigger value="taxes">Tax Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Income vs. Expenses ({yearFilter})</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyIncomeData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "8px",
                          border: "1px solid rgba(0, 0, 0, 0.05)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                        formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                      />
                      <Legend />
                      <Bar 
                        dataKey="income" 
                        fill="#0ea5e9" 
                        name="Income"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="expenses" 
                        fill="#f97316" 
                        name="Expenses"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Income by Project</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectIncomeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {projectIncomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`$${value.toLocaleString()}`, "Expense"]}
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
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="pt-4">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="taxes" className="pt-4">
            <TaxCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default FinancesPage;
