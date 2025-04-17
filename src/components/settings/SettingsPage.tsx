
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Bell, User, Sliders } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useSettings } from "./hooks/useSettings";
import AccountTab from "./tabs/AccountTab";
import PreferencesTab from "./tabs/PreferencesTab";
import NotificationsTab from "./tabs/NotificationsTab";
import { UserSettings } from "./types";

const SettingsPage = () => {
  const { user } = useAuth();
  const { loadUserSettings, isLoading, onSubmitAccount, onSubmitPreferences, onSubmitNotifications } = useSettings();
  const [settings, setSettings] = React.useState<UserSettings | null>(null);
  
  // Load settings from localStorage
  useEffect(() => {
    const userSettings = loadUserSettings();
    setSettings(userSettings);
  }, [user?.email]);

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-6 md:py-8 space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and account settings</p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <AccountTab 
            initialSettings={settings} 
            onSave={onSubmitAccount} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <PreferencesTab 
            initialSettings={settings} 
            onSave={onSubmitPreferences} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationsTab 
            initialSettings={settings} 
            onSave={onSubmitNotifications} 
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
