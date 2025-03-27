
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InvoiceActions: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline">
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>
      <Button size="sm" variant="outline">
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
      <Button size="sm" variant="outline">
        <Mail className="h-4 w-4 mr-1" /> Email
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default InvoiceActions;
