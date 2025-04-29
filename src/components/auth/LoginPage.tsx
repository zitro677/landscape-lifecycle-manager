
import React from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { useLoginForm } from "./hooks/useLoginForm";
import EmailLoginForm from "./components/EmailLoginForm";
import GuestLoginButton from "./components/GuestLoginButton";
import LoginErrorMessage from "./components/LoginErrorMessage";

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
            />
          </CardContent>
          
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              This is a demo application. If guest login fails, please use email/password.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
