
import React from "react";
import { Button } from "@/components/ui/button";

interface GuestLoginButtonProps {
  onClick: () => Promise<void>;
  isLoading: boolean;
}

const GuestLoginButton: React.FC<GuestLoginButtonProps> = ({ onClick, isLoading }) => {
  return (
    <div className="mt-4">
      <Button 
        onClick={onClick} 
        className="w-full"
        variant="secondary"
        disabled={isLoading}
      >
        Continue as Guest
      </Button>
    </div>
  );
};

export default GuestLoginButton;
