
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TaxResults } from '../hooks/useTaxCalculator';

interface TaxResultsSectionProps {
  taxResults: TaxResults;
}

export const TaxResultsSection: React.FC<TaxResultsSectionProps> = ({ taxResults }) => {
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
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>Tax Calculation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-muted-foreground">Total Income</Label>
          <p className="text-xl font-semibold truncate" title={`$${taxResults.totalIncome.toLocaleString()}`}>
            ${taxResults.totalIncome.toLocaleString()}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Total Deductions</Label>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400 truncate" title={`$${taxResults.totalDeductions.toLocaleString()}`}>
            ${taxResults.totalDeductions.toLocaleString()}
          </p>
        </div>
        <Separator />
        <div>
          <Label className="text-muted-foreground">Taxable Income</Label>
          <p className="text-xl font-semibold truncate" title={`$${taxResults.taxableIncome.toLocaleString()}`}>
            ${taxResults.taxableIncome.toLocaleString()}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Estimated Tax</Label>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 truncate" title={`$${taxResults.estimatedTax.toLocaleString()}`}>
            ${taxResults.estimatedTax.toLocaleString()}
          </p>
        </div>
        <div>
          <Label className="text-muted-foreground">Effective Tax Rate</Label>
          <p className="text-xl font-semibold truncate" title={`${taxResults.effectiveTaxRate.toFixed(1)}%`}>
            {taxResults.effectiveTaxRate.toFixed(1)}%
          </p>
        </div>
        <Separator />
        <div>
          <Label className="text-muted-foreground">After-Tax Income</Label>
          <p className="text-xl font-bold truncate" title={`$${(taxResults.totalIncome - taxResults.estimatedTax).toLocaleString()}`}>
            ${(taxResults.totalIncome - taxResults.estimatedTax).toLocaleString()}
          </p>
        </div>

        <div className="h-[200px] mt-4">
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
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
        </div>
      </CardContent>
    </Card>
  );
};
