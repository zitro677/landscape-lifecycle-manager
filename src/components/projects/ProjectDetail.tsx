
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedPage from "../shared/AnimatedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import refactored components
import ProjectHeader from "./detail/ProjectHeader";
import ProjectOverview from "./detail/ProjectOverview";
import TeamMembers from "./detail/TeamMembers";
import ProjectTabs from "./detail/ProjectTabs";
import { getProjectExtraData, getStatusColor } from "./detail/ProjectDataProvider";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find the project with the matching ID from localStorage
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Get extra data for the project
  const [extraData, setExtraData] = useState<any>({});
  
  // Load project data
  useEffect(() => {
    const loadProject = () => {
      const storedProjects = localStorage.getItem("projectsData");
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const foundProject = projects.find((p: any) => p.id === id);
        
        if (foundProject) {
          setProject(foundProject);
          
          // Check if the project has extraData
          if (foundProject.extraData) {
            setExtraData(foundProject.extraData);
          } else {
            // Use default extra data
            const defaultExtraData = getProjectExtraData(id || "");
            setExtraData(defaultExtraData);
          }
        }
      }
      setLoading(false);
    };
    
    loadProject();
  }, [id]);

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Set team members when project loads
  useEffect(() => {
    if (project?.team) {
      setTeamMembers(
        project.team.map((member: any) => {
          if (typeof member === 'string') {
            // Convert string team members to objects
            return { name: member, role: "Team Member", avatar: "" };
          }
          return member;
        })
      );
    }
  }, [project]);

  if (loading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Loading Project...</h1>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!project) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Project Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>The project you're looking for doesn't exist or has been removed.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/projects")}
              >
                Return to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        {/* Project Header */}
        <ProjectHeader 
          projectId={project.id}
          projectName={project.name}
          projectStatus={project.status}
          getStatusColor={getStatusColor}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Project Overview */}
          <ProjectOverview 
            project={project}
            extraData={extraData}
            teamSize={teamMembers.length}
          />

          {/* Team Members */}
          <TeamMembers 
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
          />
        </div>

        {/* Project Tabs (Tasks, Materials, Notes) */}
        <ProjectTabs 
          extraData={extraData}
          getStatusColor={getStatusColor}
          projectId={project.id}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProjectDetail;
