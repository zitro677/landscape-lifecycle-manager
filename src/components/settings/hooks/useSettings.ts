
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";

export const useSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user settings from localStorage
  const loadUserSettings = () => {
    try {
      const storedSettings = localStorage.getItem("user_settings");
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    
    // Default settings if nothing found
    return {
      name: user?.name || "John Doe",
      email: user?.email || "user@example.com",
      company: "Landscape Irrigation",
      bio: "I'm a landscape professional specializing in irrigation systems and sustainable landscaping solutions.",
      darkMode: false,
      compactView: true,
      defaultDashboard: "overview",
      emailNotifications: true,
      projectUpdates: true,
      invoiceReminders: true,
      marketingEmails: false,
      smsNotifications: false
    };
  };
  
  // Save settings to localStorage
  const saveUserSettings = (settings: any) => {
    try {
      localStorage.setItem("user_settings", JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  const onSubmitAccount = (data: any) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update account information
    const updatedSettings = {
      ...currentSettings,
      name: data.name,
      email: data.email,
      company: data.company,
      bio: data.bio
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Account information updated successfully");
    } else {
      toast.error("Failed to save account information");
    }
    
    setIsLoading(false);
  };

  const onSubmitPreferences = (data: any) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update preferences
    const updatedSettings = {
      ...currentSettings,
      darkMode: data.darkMode,
      compactView: data.compactView,
      defaultDashboard: data.defaultDashboard
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Preferences updated successfully");
    } else {
      toast.error("Failed to save preferences");
    }
    
    setIsLoading(false);
  };

  const onSubmitNotifications = (data: any) => {
    setIsLoading(true);
    
    // Get current settings
    const currentSettings = loadUserSettings();
    
    // Update notification settings
    const updatedSettings = {
      ...currentSettings,
      emailNotifications: data.emailNotifications,
      projectUpdates: data.projectUpdates,
      invoiceReminders: data.invoiceReminders,
      marketingEmails: data.marketingEmails,
      smsNotifications: data.smsNotifications
    };
    
    // Save to localStorage
    if (saveUserSettings(updatedSettings)) {
      toast.success("Notification settings updated successfully");
    } else {
      toast.error("Failed to save notification settings");
    }
    
    setIsLoading(false);
  };

  return {
    loadUserSettings,
    isLoading,
    onSubmitAccount,
    onSubmitPreferences,
    onSubmitNotifications
  };
};
