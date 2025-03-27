
import React from "react";
import { motion } from "framer-motion";
import OverviewCard from "./OverviewCard";
import RevenueChart from "./RevenueChart";
import ProjectStatusChart from "./ProjectStatusChart";
import AnimatedPage from "../shared/AnimatedPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../ui/data-table";
import { BarChart3, PenTool, FileText, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const revenueData = [
  { name: "Jan", revenue: 10000, expenses: 7000 },
  { name: "Feb", revenue: 12000, expenses: 7500 },
  { name: "Mar", revenue: 9000, expenses: 6800 },
  { name: "Apr", revenue: 17000, expenses: 9000 },
  { name: "May", revenue: 21000, expenses: 11000 },
  { name: "Jun", revenue: 19000, expenses: 9800 },
  { name: "Jul", revenue: 23000, expenses: 12000 },
];

const projectStatusData = [
  { name: "Completed", value: 54, color: "#10b981" },
  { name: "In Progress", value: 32, color: "#0ea5e9" },
  { name: "Planning", value: 14, color: "#8b5cf6" },
];

const recentProjects = [
  {
    id: "P-2023-089",
    client: "Johnson Family",
    status: "In Progress",
    dueDate: "2023-12-15",
    value: "$8,750",
  },
  {
    id: "P-2023-088",
    client: "Oakridge Community Center",
    status: "Planning",
    dueDate: "2024-01-10",
    value: "$22,500",
  },
  {
    id: "P-2023-087",
    client: "Peterson Residence",
    status: "Completed",
    dueDate: "2023-11-30",
    value: "$6,200",
  },
  {
    id: "P-2023-086",
    client: "Sunset Hills Park",
    status: "In Progress",
    dueDate: "2023-12-20",
    value: "$15,300",
  },
];

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status");
      const colorMap: Record<string, string> = {
        "Completed": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        "Planning": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      };
      
      return (
        <Badge className={`${colorMap[status]} hover:${colorMap[status]}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

const DashboardPage: React.FC = () => {
  return (
    <AnimatedPage>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 mb-6">
            Overview of your landscape business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <OverviewCard
            title="Total Revenue"
            value="$125,430"
            description="vs. last month"
            icon={BarChart3}
            trend={12}
            delay={0}
          />
          <OverviewCard
            title="Active Projects"
            value="8"
            description="2 due this week"
            icon={FolderKanban}
            trend={0}
            delay={1}
          />
          <OverviewCard
            title="Pending Invoices"
            value="$32,580"
            description="5 invoices pending"
            icon={FileText}
            trend={-4}
            delay={2}
          />
          <OverviewCard
            title="New Proposals"
            value="12"
            description="3 awaiting approval"
            icon={PenTool}
            trend={24}
            delay={3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RevenueChart data={revenueData} />
          <ProjectStatusChart data={projectStatusData} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={recentProjects}
                searchColumn="client"
                searchPlaceholder="Search clients..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DashboardPage;
