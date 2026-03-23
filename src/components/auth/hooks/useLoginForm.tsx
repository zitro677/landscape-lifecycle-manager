
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);

  // Check if this is the first user to sign up
  useEffect(() => {
    const checkUserCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          setUserCount(count || 0);
        }
      } catch (error) {
        console.error("Error checking user count:", error);
      }
    };

    checkUserCount();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const redirectToOAuth = (url: string) => {
        if (window.top && window.top !== window) {
          window.open(url, "_top");
        } else {
          window.location.href = url;
        }
      };

      // Detect if we're on a custom domain (not *.lovable.app)
      const isCustomDomain =
        !window.location.hostname.includes("lovable.app") &&
        !window.location.hostname.includes("lovableproject.com");

      if (isCustomDomain) {
        // Bypass Lovable auth-bridge — it doesn't exist on custom servers
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        if (data?.url) {
          const oauthUrl = new URL(data.url);
          const allowedHosts = [
            "accounts.google.com",
            "eftohgkfjnmlxmkcbvxq.supabase.co",
          ];
          if (!allowedHosts.some((host) => oauthUrl.hostname === host)) {
            throw new Error("Invalid OAuth redirect URL");
          }
          redirectToOAuth(data.url);
        }
      } else {
        // On Lovable domains, use managed auth flow
        const isEmbedded = window.top !== window;

        if (isEmbedded) {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: window.location.origin,
              skipBrowserRedirect: true,
            },
          });

          if (error) throw error;

          if (data?.url) {
            const oauthUrl = new URL(data.url);
            const allowedHosts = [
              "accounts.google.com",
              "eftohgkfjnmlxmkcbvxq.supabase.co",
            ];
            if (!allowedHosts.some((host) => oauthUrl.hostname === host)) {
              throw new Error("Invalid OAuth redirect URL");
            }
            redirectToOAuth(data.url);
          }
        } else {
          const { error } = await lovable.auth.signInWithOAuth("google", {
            redirect_uri: window.location.origin,
          });

          if (error) throw error;
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorMessage(error.message || "Failed to login with Google");
      toast.error("Failed to login with Google");
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Try to create a guest session
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        if (error.code === 'anonymous_provider_disabled') {
          throw new Error(
            "Anonymous sign-ins are disabled in your Supabase project. Please use email/password login instead."
          );
        }
        throw error;
      }
      
      toast.success("Logged in as guest user");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Failed to log in");
      toast.error("Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      console.log("Email login successful:", data.user?.email);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Email not confirmed")) {
        setErrorMessage("Please check your email to confirm your account before logging in.");
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        setErrorMessage(error.message || "Login failed. Please try again.");
      }
      
      toast.error("Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Check if this is the first user to sign up
      const isFirstUser = userCount === 0;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      // If this is the first user, make them an admin
      if (isFirstUser && data?.user) {
        console.log("First user detected, setting as admin");
        toast.success("Registration successful! You will be the administrator.");
      } else {
        toast.success("Registration successful! Please check your email for confirmation.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.message || "Registration failed. Please try again.");
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleGuestLogin,
    handleEmailLogin,
    handleSignUp,
    handleGoogleLogin
  };
};
