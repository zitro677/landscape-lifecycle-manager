
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2, UserPlus, Save, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserWithRole {
  id: string;
  email: string;
  role: 'admin' | 'read_only';
}

const UserManagementTab = () => {
  const { user, isAdmin, userRole, updateUserRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<'admin' | 'read_only'>('read_only');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // We need to get users from the auth schema
      // But since we can't access auth.users directly via the JS client,
      // we'll use the user_roles table and join with profiles
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          profiles:user_id(email)
        `);

      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        return;
      }

      if (data) {
        const formattedUsers = data.map(item => ({
          id: item.user_id,
          email: item.profiles?.email || 'Unknown email',
          role: item.role
        }));
        
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'read_only') => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    }
  };

  const inviteUser = async () => {
    if (!newUserEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setInviteLoading(true);
      
      // In a real application, you would send an invitation email
      // For this demo, we'll show a message with instructions
      toast.success(`Invitation would be sent to ${newUserEmail} with role: ${newUserRole}`);
      
      // Clear form
      setNewUserEmail("");
      setNewUserRole('read_only');
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Alert>
        <AlertDescription>
          You need administrator privileges to access user management.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">User Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage users and their access roles
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-4">Invite New User</h4>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="sm:flex-1"
              />
              <Select
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value as 'admin' | 'read_only')}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="read_only">Read Only</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={inviteUser} 
                disabled={inviteLoading}
              >
                {inviteLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                Invite
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Current Users</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No users found
                  </p>
                ) : (
                  users.map((userItem) => (
                    <div 
                      key={userItem.id} 
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4"
                    >
                      <div className="mb-2 sm:mb-0">
                        <p className="font-medium">{userItem.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {userItem.id === user?.id ? "(You)" : ""}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Select
                          value={userItem.role}
                          onValueChange={(value) => 
                            handleRoleChange(userItem.id, value as 'admin' | 'read_only')
                          }
                          disabled={userItem.id === user?.id} // Cannot change own role
                        >
                          <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="read_only">Read Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
