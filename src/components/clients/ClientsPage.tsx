
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "./useClients";
import AnimatedPage from "../shared/AnimatedPage";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { clients, isLoading, deleteClient } = useClients();

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Clients</h1>
            <p className="text-muted-foreground">Manage your clients</p>
          </div>
          <Button onClick={() => navigate("/clients/new")} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" /> Add New Client
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle>{client.name}</CardTitle>
                  <CardDescription>{client.email}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  {client.address && (
                    <p className="whitespace-pre-wrap">{client.address}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => navigate(`/clients/edit/${client.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteClient(client.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-dashed border-2 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No clients yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first client to get started with invoicing
                </p>
                <Button onClick={() => navigate("/clients/new")} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Add New Client
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedPage>
  );
};

export default ClientsPage;
