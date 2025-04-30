
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { useLoginForm } from "./hooks/useLoginForm";
import EmailLoginForm from "./components/EmailLoginForm";
import GuestLoginButton from "./components/GuestLoginButton";
import LoginErrorMessage from "./components/LoginErrorMessage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { 
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleGuestLogin,
    handleEmailLogin,
    handleSignUp
  } = useLoginForm();
  
  // Admin registration dialog state
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Handle admin registration
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setAdminLoading(true);
      
      // First register the user
      const { data, error } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Then manually set their role to admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({ 
            user_id: data.user.id, 
            role: 'admin' 
          })
          .select();
        
        if (roleError) throw roleError;
        
        toast.success(`Admin ${adminEmail} registered successfully!`);
        setAdminDialogOpen(false);
        setAdminEmail("");
        setAdminPassword("");
      }
    } catch (error: any) {
      console.error("Admin registration error:", error);
      toast.error(error.message || "Failed to register admin");
    } finally {
      setAdminLoading(false);
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
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <LoginErrorMessage message={errorMessage} />
            
            <EmailLoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              handleEmailLogin={handleEmailLogin}
              handleSignUp={handleSignUp}
            />
            
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-muted"></div>
            </div>
            
            <GuestLoginButton 
              onClick={handleGuestLogin} 
              isLoading={isLoading}
              onAddAdmin={() => setAdminDialogOpen(true)}
            />
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              This is a demo application. If guest login fails, please use email/password.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Admin Registration Dialog */}
      <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account with full permissions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAdmin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Create a strong password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAdminDialogOpen(false)}
                className="mr-2"
                disabled={adminLoading}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                disabled={adminLoading}
              >
                {adminLoading ? "Registering..." : "Register Admin"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
