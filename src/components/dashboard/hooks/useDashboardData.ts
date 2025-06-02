
import { useState, useEffect } from "react";
import { getAllProjects } from "../../projects/hooks/projectData";
import { supabase } from "@/integrations/supabase/client";

export const useDashboardData = () => {
  // State for dashboard data
  const [projects, setProjects] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load all data from database
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Get the current user session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user?.id) {
          console.log("No authenticated user found");
          setIsLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;

        // Load projects from localStorage (as they're stored there)
        const allProjects = getAllProjects();
        setProjects(allProjects);

        // Load proposals from Supabase - fix the relationship issue
        const fetchProposals = async () => {
          try {
            const { data, error } = await supabase
              .from('proposals')
              .select(`
                *,
                clients!proposals_client_id_fkey (
                  name,
                  email,
                  address,
                  phone
                )
              `)
              .eq('user_id', userId)
              .order('created_at', { ascending: false });
              
            if (error) {
              console.error("Error fetching proposals:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching proposals:", error);
            return [];
          }
        };

        // Load invoices from Supabase
        const fetchInvoices = async () => {
          try {
            const { data, error } = await supabase
              .from('invoices')
              .select(`
                *,
                clients!invoices_client_id_fkey (
                  name,
                  email
                )
              `)
              .eq('user_id', userId)
              .order('issue_date', { ascending: false });
              
            if (error) {
              console.error("Error fetching invoices:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching invoices:", error);
            return [];
          }
        };

        // Load clients from Supabase
        const fetchClients = async () => {
          try {
            const { data, error } = await supabase
              .from('clients')
              .select('*')
              .eq('user_id', userId)
              .order('name', { ascending: true });
              
            if (error) {
              console.error("Error fetching clients:", error);
              return [];
            }
            
            return data || [];
          } catch (error) {
            console.error("Unexpected error fetching clients:", error);
            return [];
          }
        };
        
        const [proposalsData, invoicesData, clientsData] = await Promise.all([
          fetchProposals(),
          fetchInvoices(),
          fetchClients()
        ]);
        
        setProposals(proposalsData);
        setInvoices(invoicesData);
        setClients(clientsData);
        
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Check for updates every 30 seconds

    // Set up localStorage change listener for projects
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

  // Calculate overview statistics from real data
  const calculateOverviewStats = () => {
    // Calculate total revenue from completed projects and paid invoices
    const completedProjects = projects.filter(p => p.status === "Completed");
    const completedProjectsRevenue = completedProjects.reduce((sum, project) => {
      const budget = typeof project.budget === 'string' 
        ? parseFloat(project.budget.replace(/[$,]/g, '')) 
        : project.budget || 0;
      return sum + budget;
    }, 0);

    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const paidInvoicesRevenue = paidInvoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.amount) || 0);
    }, 0);

    const totalRevenue = completedProjectsRevenue + paidInvoicesRevenue;

    // Calculate active projects
    const activeProjects = projects.filter(p => 
      p.status === "In Progress" || p.status === "Planning").length;
    
    // Calculate projects due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const dueSoonProjects = projects.filter(p => {
      if (!p.dueDate) return false;
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;

    // Calculate pending invoices amount
    const pendingInvoices = invoices.filter(inv => 
      inv.status === "Pending" || inv.status === "Sent");
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.amount) || 0);
    }, 0);

    // Calculate proposal statistics
    const newProposalCount = proposals.length;
    const pendingProposals = proposals.filter(p => 
      p.status === "Pending" || p.status === "Sent").length;

    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      revenueTrend: totalRevenue > 0 ? 12 : 0, // Placeholder trend
      activeProjects,
      dueSoonProjects,
      pendingInvoices: `$${pendingInvoicesAmount.toLocaleString()}`,
      pendingInvoicesCount: pendingInvoices.length,
      newProposals: newProposalCount,
      pendingApprovals: pendingProposals
    };
  };

  // Calculate project status data for the chart from real data
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

  // Generate revenue data from real invoices and projects
  const generateRevenueData = () => {
    const currentDate = new Date();
    const monthsData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate revenue from invoices for this month
      const monthRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.issue_date);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear() &&
                 invoice.status === "Paid";
        })
        .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);

      // For expenses, we'll use a placeholder since we don't have expense data in the current schema
      const monthExpenses = monthRevenue * 0.6; // Placeholder: assume 60% expense ratio

      monthsData.push({
        name: monthName,
        revenue: monthRevenue,
        expenses: monthExpenses
      });
    }
    
    return monthsData;
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
    invoices: invoices,
    clients: clients,
    isLoading
  };
};
