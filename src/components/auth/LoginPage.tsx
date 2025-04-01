
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Mock login function for testing
  const handleGuestLogin = async () => {
    try {
      // Create a guest session
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in as guest user");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to log in");
    }
  };

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Landscape Irrigation</CardTitle>
            <CardDescription>
              Authentication has been simplified for testing
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground mb-6">
              Use the guest login option below for testing the application
            </p>
            
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={handleGuestLogin} 
                className="w-full"
                variant="default"
              >
                Continue as Guest
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              This is a demo application. No real authentication is required.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
