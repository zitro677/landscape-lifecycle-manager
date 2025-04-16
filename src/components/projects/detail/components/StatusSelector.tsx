
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { updateProject } from "../../hooks/projectOperations";

interface StatusSelectorProps {
  projectId: string;
  currentStatus: string;
  getStatusColor: (status: string) => string;
  onStatusChange?: (newStatus: string) => void;
}

const statusOptions = [
  { value: "Planning", label: "Planning" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
];

const StatusSelector: React.FC<StatusSelectorProps> = ({
  projectId,
  currentStatus,
  getStatusColor,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = (newStatus: string) => {
    // Don't do anything if status hasn't changed
    if (newStatus === status) {
      setOpen(false);
      return;
    }

    try {
      // Update the local state first for immediate feedback
      setStatus(newStatus);
      
      // Close the dropdown
      setOpen(false);
      
      // Update the project with the new status
      const result = updateProject(projectId, { status: newStatus });
      
      if (result) {
        toast.success(`Project status updated to ${newStatus}`);
        
        // Call the callback if provided
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      } else {
        // If update failed, revert back to original status
        setStatus(currentStatus);
        toast.error("Failed to update project status");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      // If update failed, revert back to original status
      setStatus(currentStatus);
      toast.error("Failed to update project status");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center justify-between w-[200px]"
        >
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandEmpty>No status found.</CommandEmpty>
          <CommandGroup>
            {statusOptions.map((statusOption) => (
              <CommandItem
                key={statusOption.value}
                value={statusOption.value}
                onSelect={() => handleStatusChange(statusOption.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    status === statusOption.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <Badge className={getStatusColor(statusOption.value)}>
                  {statusOption.label}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusSelector;
