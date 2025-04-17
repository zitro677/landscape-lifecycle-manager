
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const SettingsPage = () => {
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
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details and personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium">Email</h3>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Name</h3>
                <p className="text-sm text-muted-foreground">John Doe</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Company</h3>
                <p className="text-sm text-muted-foreground">Landscape Irrigation</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Password last changed: 30 days ago
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Display settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Default Views</CardTitle>
              <CardDescription>
                Configure your default views for projects and invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Default view settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Notification settings will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
