
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface GuestLoginButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
  onAddAdmin?: () => void; // New prop for adding admin
}

const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ 
  onClick, 
  isLoading,
  onAddAdmin 
}) => {
  return (
    <div className="mt-4 space-y-2">
      <Button 
        onClick={onClick} 
        className="w-full"
        variant="secondary"
        disabled={isLoading}
      >
        Continue as Guest
      </Button>
      
      {onAddAdmin && (
        <Button
          onClick={onAddAdmin}
          className="w-full flex items-center justify-center"
          variant="outline"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Register New Admin
        </Button>
      )}
    </div>
  );
};

export default GuestLoginButton;
