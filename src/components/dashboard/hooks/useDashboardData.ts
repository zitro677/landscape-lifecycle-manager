
import { useState, useEffect } from "react";
import { getAllProjects } from "../../projects/hooks/projectData";

export const useDashboardData = () => {
  // State for dashboard data
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load projects data
  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      try {
        const allProjects = getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error("Error loading projects for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Check for updates every 30 seconds

    // Set up localStorage change listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "landscape_projects" || e.key === "projectsData") {
        setLastUpdate(Date.now());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [lastUpdate]);

  // Calculate overview statistics
  const calculateOverviewStats = () => {
    const activeProjects = projects.filter(p => 
      p.status === "In Progress" || p.status === "Planning").length;
    
    const totalBudget = projects.reduce((sum, project) => {
      const budget = typeof project.budget === 'string' 
        ? parseFloat(project.budget.replace(/[$,]/g, '')) 
        : 0;
      return sum + budget;
    }, 0);

    // Calculate projects due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const dueSoonProjects = projects.filter(p => {
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;

    return {
      totalRevenue: `$${totalBudget.toLocaleString()}`,
      revenueTrend: 12,
      activeProjects,
      dueSoonProjects,
      pendingInvoices: "$32,580",
      pendingInvoicesCount: 5,
      newProposals: 12,
      pendingApprovals: 3
    };
  };

  // Calculate project status data for the chart
  const calculateProjectStatusData = () => {
    const statusCounts: Record<string, number> = {
      "Completed": 0,
      "In Progress": 0,
      "Planning": 0,
      "On Hold": 0
    };

    projects.forEach(project => {
      if (statusCounts[project.status] !== undefined) {
        statusCounts[project.status]++;
      }
    });

    const statusColors: Record<string, string> = {
      "Completed": "#10b981",
      "In Progress": "#0ea5e9",
      "Planning": "#8b5cf6",
      "On Hold": "#f59e0b"
    };

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name]
    }));
  };

  // Generate revenue data (currently mock data)
  // In a real app, this would come from actual financial data
  const generateRevenueData = () => {
    return [
      { name: "Jan", revenue: 10000, expenses: 7000 },
      { name: "Feb", revenue: 12000, expenses: 7500 },
      { name: "Mar", revenue: 9000, expenses: 6800 },
      { name: "Apr", revenue: 17000, expenses: 9000 },
      { name: "May", revenue: 21000, expenses: 11000 },
      { name: "Jun", revenue: 19000, expenses: 9800 },
      { name: "Jul", revenue: 23000, expenses: 12000 },
    ];
  };

  // Get recent projects (5 most recent)
  const getRecentProjects = () => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
      .slice(0, 5)
      .map(project => ({
        id: project.id,
        client: project.client,
        status: project.status,
        dueDate: project.dueDate,
        value: project.budget
      }));
  };

  return {
    overviewStats: calculateOverviewStats(),
    revenueData: generateRevenueData(),
    projectStatusData: calculateProjectStatusData(),
    recentProjects: getRecentProjects(),
    isLoading
  };
};
