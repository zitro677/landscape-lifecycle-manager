
import React from "react";
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
import { ArrowLeft, Clock, Calendar, DollarSign, Users, Edit, Share, Download, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AnimatedPage from "../shared/AnimatedPage";

// Mock project data
const project = {
  id: "PRJ-2023-001",
  name: "Johnson Backyard Renovation",
  client: "Johnson Family",
  status: "In Progress",
  progress: 65,
  startDate: "2023-10-10",
  dueDate: "2023-12-15",
  budget: "$8,500",
  totalCost: "$5,525",
  estimatedHours: 120,
  hoursLogged: 78,
  team: [
    { name: "John Smith", role: "Project Manager", avatar: "" },
    { name: "Maria Garcia", role: "Landscape Designer", avatar: "" },
  ],
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
  ],
  description: "Complete backyard renovation for the Johnson family. Project includes hardscaping with natural stone, installation of a cedar pergola, comprehensive irrigation system, and drought-resistant planting design. The client has requested a low-maintenance design with natural materials that complements their home's architectural style."
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

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real app, you would fetch the project data based on the ID
  // For now, we'll just use our mock data

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
                  {project.description}
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
                        {project.hoursLogged} of {project.estimatedHours} hrs logged
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Budget</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.totalCost} of {project.budget} used
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Team</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.team.length} team members assigned
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
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
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
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1">
                  <Users className="h-4 w-4" />
                  <span>Manage Team</span>
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
                      {project.tasks.map((task, index) => (
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
                      {project.materials.map((material, index) => (
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
                  <div className="space-y-6">
                    {project.notes.map((note, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{note.author}</h3>
                          <p className="text-sm text-muted-foreground">
                            {note.date}
                          </p>
                        </div>
                        <p className="text-muted-foreground">{note.content}</p>
                        {index < project.notes.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default ProjectDetail;
