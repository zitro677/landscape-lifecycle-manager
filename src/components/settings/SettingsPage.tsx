
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountTab from "./tabs/AccountTab";
import NotificationsTab from "./tabs/NotificationsTab";
import PreferencesTab from "./tabs/PreferencesTab";
import UserManagementTab from "./tabs/UserManagementTab";
import AnimatedPage from "../shared/AnimatedPage";
import { useAuth } from "../auth/AuthProvider";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const { isAdmin } = useAuth();

  return (
    <AnimatedPage>
      <div className="container mx-auto py-6 space-y-4 max-w-5xl">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
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
              <AccountTab />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
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
