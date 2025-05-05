
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountTab from "./tabs/AccountTab";
import NotificationsTab from "./tabs/NotificationsTab";
import PreferencesTab from "./tabs/PreferencesTab";
import UserManagementTab from "./tabs/UserManagementTab";
import AnimatedPage from "../shared/AnimatedPage";
import { useAuth } from "../auth/AuthProvider";
import { useSettings } from "./hooks/useSettings";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { isAdmin, signOut } = useAuth();
  const { 
    loadUserSettings, 
    isLoading, 
    onSubmitAccount, 
    onSubmitPreferences, 
    onSubmitNotifications 
  } = useSettings();
  
  // Load user settings
  const userSettings = loadUserSettings();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto py-6 space-y-4 max-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="account">
              <AccountTab 
                initialSettings={userSettings} 
                onSave={onSubmitAccount} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab 
                initialSettings={userSettings} 
                onSave={onSubmitPreferences} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab 
                initialSettings={userSettings} 
                onSave={onSubmitNotifications} 
                isLoading={isLoading} 
              />
            </TabsContent>
            {isAdmin && (
              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default SettingsPage;
