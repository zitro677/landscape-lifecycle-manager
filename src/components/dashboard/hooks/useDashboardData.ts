
import { useState, useEffect } from "react";
import { useProjectsData } from "./data/useProjectsData";
import { useSupabaseData } from "./data/useSupabaseData";
import { useOverviewStats } from "./calculations/useOverviewStats";
import { useChartData } from "./calculations/useChartData";
import { useRecentProjects } from "./calculations/useRecentProjects";

export const useDashboardData = () => {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load data from different sources
  const { projects, isLoading: projectsLoading } = useProjectsData(lastUpdate);
  const { proposals, invoices, clients, isLoading: supabaseLoading } = useSupabaseData(lastUpdate);

  const isLoading = projectsLoading || supabaseLoading;

  // Calculate derived data
  const overviewStats = useOverviewStats(projects, invoices, proposals);
  const { revenueData, projectStatusData } = useChartData(projects, invoices);
  const recentProjects = useRecentProjects(projects);

  useEffect(() => {
    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000); // Check for updates every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    overviewStats,
    revenueData,
    projectStatusData,
    recentProjects,
    proposals,
    invoices,
    clients,
    isLoading
  };
};
