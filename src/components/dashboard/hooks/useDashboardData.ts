
import { useState, useEffect } from "react";
import { getAllProjects } from "../../projects/hooks/projectData";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = () => {
  // State for dashboard data
  const [projects, setProjects] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load projects and proposals data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load projects
        const allProjects = getAllProjects();
        setProjects(allProjects);
        
        // Load proposals from supabase
        const fetchProposals = async () => {
          try {
            // Get the current user session
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session?.user?.id) {
              console.log("No authenticated user found for proposals");
              return [];
            }
            
            const userId = sessionData.session.user.id;
            const { data, error } = await supabase
              .from('proposals')
              .select(`
                *,
                clients!client_id (
                  name,
                  email,
                  address,
                  phone
                )
              `)
              .eq('user_id', userId)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error("Error fetching proposals for dashboard:", error);
              return [];
            }
            
            console.log("Dashboard: Fetched proposals count:", data?.length);
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching proposals for dashboard:", error);
            return [];
          }
        };
        
        const proposalsData = await fetchProposals();
        setProposals(proposalsData);
      } catch (error) {
        console.error("Error loading data for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

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

    // Calculate proposal statistics
    const newProposalCount = proposals.length;
    const pendingProposals = proposals.filter(p => 
      p.status === "Pending" || p.status === "Sent").length;

    return {
      totalRevenue: `$${totalBudget.toLocaleString()}`,
      revenueTrend: 12,
      activeProjects,
      dueSoonProjects,
      pendingInvoices: "$32,580",
      pendingInvoicesCount: 5,
      newProposals: newProposalCount,
      pendingApprovals: pendingProposals
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

  // Get recent projects (4 most recent by creation date)
  const getRecentProjects = () => {
    return [...projects]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.startDate).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.startDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 4)
      .map(project => ({
        id: project.id,
        client: project.client,
        status: project.status,
        dueDate: project.dueDate,
        budget: project.budget
      }));
  };

  return {
    overviewStats: calculateOverviewStats(),
    revenueData: generateRevenueData(),
    projectStatusData: calculateProjectStatusData(),
    recentProjects: getRecentProjects(),
    proposals: proposals,
    isLoading
  };
};
