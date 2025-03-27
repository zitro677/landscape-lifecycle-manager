
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "../ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Filter } from "lucide-react";
import AnimatedPage from "../shared/AnimatedPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock data for projects
const projects = [
  {
    id: "PRJ-2023-001",
    name: "Johnson Backyard Renovation",
    client: "Johnson Family",
    status: "In Progress",
    progress: 65,
    startDate: "2023-10-10",
    dueDate: "2023-12-15",
    budget: "$8,500",
    team: ["John Smith", "Maria Garcia"],
  },
  {
    id: "PRJ-2023-002",
    name: "Oakridge Community Park",
    client: "Oakridge Community Center",
    status: "Planning",
    progress: 20,
    startDate: "2023-11-05",
    dueDate: "2024-02-28",
    budget: "$24,000",
    team: ["John Smith", "Maria Garcia", "Robert Chen", "Lisa Johnson"],
  },
  {
    id: "PRJ-2023-003",
    name: "Peterson Landscape Design",
    client: "Peterson Residence",
    status: "Completed",
    progress: 100,
    startDate: "2023-09-01",
    dueDate: "2023-10-30",
    budget: "$6,200",
    team: ["Maria Garcia", "Lisa Johnson"],
  },
  {
    id: "PRJ-2023-004",
    name: "Sunset Hills Park Maintenance",
    client: "Sunset Hills HOA",
    status: "In Progress",
    progress: 45,
    startDate: "2023-10-01",
    dueDate: "2023-12-20",
    budget: "$15,300",
    team: ["John Smith", "Robert Chen"],
  },
  {
    id: "PRJ-2023-005",
    name: "Martinez Garden Redesign",
    client: "Martinez Family",
    status: "On Hold",
    progress: 30,
    startDate: "2023-09-15",
    dueDate: "2023-11-30",
    budget: "$5,750",
    team: ["Maria Garcia"],
  },
];

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("dueDate");

  const filteredProjects = projects.filter((project) => {
    if (statusFilter === "all") return true;
    return project.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOrder === "progress") {
      return b.progress - a.progress;
    } else if (sortOrder === "budget") {
      return parseFloat(b.budget.replace("$", "").replace(",", "")) - 
             parseFloat(a.budget.replace("$", "").replace(",", ""));
    }
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Planning":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "On Hold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Project Name",
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
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }: any) => {
        const progress = row.getValue("progress");
        return (
          <div className="w-full max-w-[100px]">
            <Progress value={progress} className="h-2" />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "budget",
      header: "Budget",
    },
    {
      accessorKey: "id",
      header: "Actions",
      cell: ({ row }: any) => {
        const projectId = row.getValue("id");
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  // Calculate project statistics
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;
  const planningProjects = projects.filter(
    (project) => project.status === "Planning"
  ).length;
  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  ).length;

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your landscape projects
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <Button
              onClick={() => navigate("/projects/new")}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> New Project
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed
              </h3>
              <Badge className={getStatusColor("Completed")}>
                {completedProjects}
              </Badge>
            </div>
            <Progress value={(completedProjects / projects.length) * 100} className="h-1 mt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="glass-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                In Progress
              </h3>
              <Badge className={getStatusColor("In Progress")}>
                {inProgressProjects}
              </Badge>
            </div>
            <Progress value={(inProgressProjects / projects.length) * 100} className="h-1 mt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="glass-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Planning
              </h3>
              <Badge className={getStatusColor("Planning")}>
                {planningProjects}
              </Badge>
            </div>
            <Progress value={(planningProjects / projects.length) * 100} className="h-1 mt-2" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="glass-card rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                On Hold
              </h3>
              <Badge className={getStatusColor("On Hold")}>
                {onHoldProjects}
              </Badge>
            </div>
            <Progress value={(onHoldProjects / projects.length) * 100} className="h-1 mt-2" />
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="on hold">On Hold</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem checked>
                  Show Client Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Show Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Show Due Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>
                  Upcoming Deadlines Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  High Budget Projects
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <DataTable
              columns={columns}
              data={sortedProjects}
              searchColumn="name"
              searchPlaceholder="Search projects..."
            />
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ProjectsPage;
