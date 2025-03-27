
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, Mail, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InvoiceCardProps {
  invoice: {
    id: string;
    client: string;
    date: string;
    dueDate: string;
    amount: string;
    status: string;
  };
  index: number;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, index }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
    >
      <Card className="overflow-hidden hover-scale card-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
            <div className="flex flex-col mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{invoice.id}</h3>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{invoice.client}</p>
              <div className="mt-2 flex flex-col sm:flex-row sm:gap-4 text-sm">
                <span>
                  <span className="text-muted-foreground">Issued:</span>{" "}
                  {invoice.date}
                </span>
                <span>
                  <span className="text-muted-foreground">Due:</span>{" "}
                  {invoice.dueDate}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <span className="text-xl font-bold">{invoice.amount}</span>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoiceCard;
