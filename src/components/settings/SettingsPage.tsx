
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Bell, User, Sliders } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Account form
  const accountForm = useForm({
    defaultValues: {
      name: "John Doe",
      email: user?.email || "user@example.com",
      company: "Landscape Irrigation",
      bio: "I'm a landscape professional specializing in irrigation systems and sustainable landscaping solutions."
    }
  });

  // Preferences form
  const preferencesForm = useForm({
    defaultValues: {
      darkMode: false,
      compactView: true,
      defaultDashboard: "overview",
      emailDigest: true
    }
  });

  // Notifications form
  const notificationsForm = useForm({
    defaultValues: {
      emailNotifications: true,
      projectUpdates: true,
      invoiceReminders: true,
      marketingEmails: false,
      smsNotifications: false
    }
  });

  const onSubmitAccount = (data) => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      console.log("Account data submitted:", data);
      toast.success("Account information updated successfully");
      setIsLoading(false);
    }, 1000);
  };

  const onSubmitPreferences = (data) => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      console.log("Preferences data submitted:", data);
      toast.success("Preferences updated successfully");
      setIsLoading(false);
    }, 1000);
  };

  const onSubmitNotifications = (data) => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      console.log("Notifications data submitted:", data);
      toast.success("Notification settings updated successfully");
      setIsLoading(false);
    }, 1000);
  };

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
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(onSubmitAccount)}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-muted/50" />
                        </FormControl>
                        <FormDescription>
                          Your email address is used for login and cannot be changed.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your company name" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Write a short bio about yourself" 
                            className="resize-none min-h-[120px]"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => toast.success("Password updated successfully")}
              >
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Form {...preferencesForm}>
            <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)}>
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize the appearance of your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={preferencesForm.control}
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Dark Mode</FormLabel>
                          <FormDescription>
                            Enable dark mode for reduced eye strain in low light environments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={preferencesForm.control}
                    name="compactView"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Compact View</FormLabel>
                          <FormDescription>
                            Display more content per page with a compact layout
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
          
          <Card>
            <CardHeader>
              <CardTitle>Default Views</CardTitle>
              <CardDescription>
                Configure your default views for projects and invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="default-dashboard">Default Dashboard View</Label>
                <select 
                  id="default-dashboard"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="overview"
                >
                  <option value="overview">Overview</option>
                  <option value="projects">Projects</option>
                  <option value="finances">Finances</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="default-project-view">Default Project View</Label>
                <select 
                  id="default-project-view"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="grid"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="kanban">Kanban</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={() => toast.success("Default views updated successfully")}
              >
                Save View Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="ml-6 space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="projectUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationsForm.watch("emailNotifications")}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Project Updates
                              </FormLabel>
                              <FormDescription>
                                Get notified about changes to your projects
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="invoiceReminders"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationsForm.watch("emailNotifications")}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Invoice Reminders
                              </FormLabel>
                              <FormDescription>
                                Receive reminders about upcoming and overdue invoices
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={!notificationsForm.watch("emailNotifications")}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Marketing Emails
                              </FormLabel>
                              <FormDescription>
                                Receive updates about new features and promotions
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SMS Notifications</FormLabel>
                            <FormDescription>
                              Receive important notifications via SMS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
