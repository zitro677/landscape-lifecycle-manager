
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Calendar, Clock, DollarSign, Users, 
  Edit, Share, Download, Plus, X, UserPlus 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AnimatedPage from "../shared/AnimatedPage";
import { projects as predefinedProjects } from "./hooks/useProjects";
import { toast } from "sonner";

// Get all projects including those from localStorage
const getAllProjects = () => {
  try {
    const localProjects = localStorage.getItem('newProjects');
    const savedProjects = localProjects ? JSON.parse(localProjects) : [];
    return [...predefinedProjects, ...savedProjects];
  } catch (error) {
    console.error('Error loading projects:', error);
    return predefinedProjects;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Planning":
    case "Not Started":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "On Hold":
    case "Pending Delivery":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

// Extra data for demo purposes (will be stored with the project in a real app)
const projectExtraData = {
  "PRJ-2023-001": {
    totalCost: "$5,525",
    estimatedHours: 120,
    hoursLogged: 78,
    description: "Complete backyard renovation for the Johnson family. Project includes hardscaping with natural stone, installation of a cedar pergola, comprehensive irrigation system, and drought-resistant planting design. The client has requested a low-maintenance design with natural materials that complements their home's architectural style.",
    tasks: [
      { name: "Initial site assessment", status: "Completed", dueDate: "2023-10-12", assignee: "John Smith" },
      { name: "Design blueprint creation", status: "Completed", dueDate: "2023-10-25", assignee: "Maria Garcia" },
      { name: "Client design approval", status: "Completed", dueDate: "2023-10-30", assignee: "John Smith" },
      { name: "Material procurement", status: "Completed", dueDate: "2023-11-05", assignee: "John Smith" },
      { name: "Site preparation", status: "In Progress", dueDate: "2023-11-15", assignee: "Maria Garcia" },
      { name: "Hardscape installation", status: "In Progress", dueDate: "2023-11-30", assignee: "Maria Garcia" },
      { name: "Planting and softscape", status: "Not Started", dueDate: "2023-12-05", assignee: "Maria Garcia" },
      { name: "Irrigation setup", status: "Not Started", dueDate: "2023-12-10", assignee: "John Smith" },
      { name: "Final walkthrough", status: "Not Started", dueDate: "2023-12-15", assignee: "John Smith" },
    ],
    materials: [
      { name: "Premium Garden Soil", quantity: "5 cubic yards", cost: "$750", status: "Delivered" },
      { name: "Flagstone Pavers", quantity: "200 sq ft", cost: "$1,600", status: "Delivered" },
      { name: "Drought-Resistant Plants", quantity: "45 units", cost: "$900", status: "Delivered" },
      { name: "Cedar Pergola Kit", quantity: "1", cost: "$1,200", status: "Pending Delivery" },
      { name: "Irrigation System", quantity: "1 set", cost: "$650", status: "Pending Delivery" },
    ],
    notes: [
      { date: "2023-10-10", author: "John Smith", content: "Initial client meeting completed. Client prefers natural materials and drought-resistant plants." },
      { date: "2023-10-25", author: "Maria Garcia", content: "Design blueprints completed and sent to client for review." },
      { date: "2023-11-05", author: "John Smith", content: "Material delivery scheduled for next week. Site preparation to begin tomorrow." },
    ]
  }
};

// Default data for new projects
const defaultExtraData = {
  totalCost: "$0",
  estimatedHours: 0,
  hoursLogged: 0,
  description: "No description available yet.",
  tasks: [],
  materials: [],
  notes: []
};

// Function to generate extra data for a project if it doesn't exist
const getProjectExtraData = (projectId: string) => {
  return projectExtraData[projectId] || defaultExtraData;
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", role: "" });
  
  // Find the project with the matching ID
  const allProjects = getAllProjects();
  const project = allProjects.find(p => p.id === id);
  
  const [teamMembers, setTeamMembers] = useState(
    project?.team?.map(member => {
      if (typeof member === 'string') {
        // Convert string team members to objects
        return { name: member, role: "Team Member", avatar: "" };
      }
      return member;
    }) || []
  );
  
  // Get extra data for the project (in a real app, this would be fetched from the server)
  const extraData = getProjectExtraData(id || "");

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

  const handleAddTeamMember = () => {
    if (newTeamMember.name.trim() === "") {
      toast.error("Team member name is required");
      return;
    }
    
    const newMember = {
      name: newTeamMember.name,
      role: newTeamMember.role || "Team Member",
      avatar: ""
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setNewTeamMember({ name: "", role: "" });
    setDialogOpen(false);
    
    toast.success("Team member added successfully");
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedTeam = [...teamMembers];
    updatedTeam.splice(index, 1);
    setTeamMembers(updatedTeam);
    toast.success("Team member removed");
  };

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Project {project.id}</p>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 md:mt-0 flex flex-wrap gap-2"
          >
            <Button variant="outline" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit Project</span>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-full lg:col-span-2"
          >
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>
                  Client: {project.client}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {extraData.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-6">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Timeline</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.startDate} to {project.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Hours</h3>
                      <p className="text-sm text-muted-foreground">
                        {extraData.hoursLogged} of {extraData.estimatedHours} hrs logged
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Budget</h3>
                      <p className="text-sm text-muted-foreground">
                        {extraData.totalCost} of {project.budget} used
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Team</h3>
                      <p className="text-sm text-muted-foreground">
                        {teamMembers.length} team members assigned
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Progress</h3>
                  <div className="space-y-1">
                    <Progress value={project.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {project.progress}% Complete
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="col-span-full lg:col-span-1"
          >
            <Card className="card-shadow">
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveTeamMember(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {teamMembers.length === 0 && (
                    <p className="text-muted-foreground text-center py-2">No team members assigned yet</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full gap-1"
                  onClick={() => setDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Team Member</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Tabs defaultValue="tasks" className="mb-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="pt-4">
              <Card className="card-shadow">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Project Tasks</CardTitle>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {extraData.tasks && extraData.tasks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Assignee</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extraData.tasks.map((task, index) => (
                          <TableRow key={index} className="hover-scale">
                            <TableCell>{task.name}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell>{task.assignee}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No tasks added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="pt-4">
              <Card className="card-shadow">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Materials</CardTitle>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Material</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {extraData.materials && extraData.materials.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extraData.materials.map((material, index) => (
                          <TableRow key={index} className="hover-scale">
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.quantity}</TableCell>
                            <TableCell>{material.cost}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(material.status)}>
                                {material.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No materials added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="pt-4">
              <Card className="card-shadow">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Project Notes</CardTitle>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Note</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  {extraData.notes && extraData.notes.length > 0 ? (
                    <div className="space-y-6">
                      {extraData.notes.map((note, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{note.author}</h3>
                            <p className="text-sm text-muted-foreground">
                              {note.date}
                            </p>
                          </div>
                          <p className="text-muted-foreground">{note.content}</p>
                          {index < extraData.notes.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No notes added yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dialog for adding team members */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new team member to this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <Input
                id="role"
                placeholder="Landscape Designer"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeamMember}>
              Add Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AnimatedPage>
  );
};

export default ProjectDetail;
