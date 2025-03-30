
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail } from "lucide-react"; // Changed Google to Mail
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      await signInWithGoogle();
      // No need to navigate here as the redirect will happen automatically
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed");
      console.error("Auth error:", error);
      setIsSubmitting(false);
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
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {authError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              <Mail className="h-5 w-5" /> {/* Changed Google to Mail icon */}
              {isSubmitting ? "Connecting..." : "Sign in with Google"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
