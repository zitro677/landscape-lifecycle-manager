
import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { useLoginForm } from "./hooks/useLoginForm";
import EmailLoginForm from "./components/EmailLoginForm";
import LoginErrorMessage from "./components/LoginErrorMessage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { 
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleEmailLogin,
    handleSignUp,
    handleGoogleLogin
  } = useLoginForm();
  
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

            {/* Google Sign In temporarily disabled - re-enable when OAuth is configured */}
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Powered by Arkana Tech
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
