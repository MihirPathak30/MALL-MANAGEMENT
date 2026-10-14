import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession, resetData, getData } from "@/utils/storage";
import { getTheme, toggleTheme } from "@/utils/theme";
import { toast } from "sonner";
import { User, Shield, RotateCcw, Sun, Moon, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const user = getSession();
  const [isDark, setIsDark] = useState(getTheme() === "dark");

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setIsDark(newTheme === "dark");
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleResetData = () => {
    resetData();
    toast.success("Demo data has been reset successfully");
    window.location.reload();
  };

  const roleMatrix = [
    {
      feature: "Dashboard",
      manager: true,
      inventory: true,
      cashier: true,
      sales: true,
    },
    {
      feature: "Inventory (Full CRUD)",
      manager: false,
      inventory: true,
      cashier: false,
      sales: false,
    },
    {
      feature: "Inventory (View Only)",
      manager: true,
      inventory: false,
      cashier: false,
      sales: false,
    },
    {
      feature: "Billing (POS)",
      manager: false,
      inventory: false,
      cashier: true,
      sales: false,
    },
    {
      feature: "Billing (Summary)",
      manager: true,
      inventory: false,
      cashier: false,
      sales: false,
    },
    {
      feature: "Customers (Manage)",
      manager: true,
      inventory: false,
      cashier: true,
      sales: true,
    },
    {
      feature: "Reports (All)",
      manager: true,
      inventory: false,
      cashier: false,
      sales: false,
    },
    {
      feature: "Reports (Specific)",
      manager: false,
      inventory: true,
      cashier: true,
      sales: true,
    },
    {
      feature: "Settings",
      manager: true,
      inventory: true,
      cashier: true,
      sales: true,
    },
  ];

  const data = getData();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 gradient-primary rounded-lg">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Username</Label>
                <p className="text-lg font-semibold">{user?.username}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Role</Label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {user?.role}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">System Version</Label>
                <p className="text-sm">v1.0.0</p>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 gradient-accent rounded-lg">
                  {isDark ? (
                    <Moon className="w-6 h-6 text-accent-foreground" />
                  ) : (
                    <Sun className="w-6 h-6 text-accent-foreground" />
                  )}
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize your interface</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                </div>
                <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Access Matrix */}
        {user?.role === "Mall Manager" && (
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Role Access Matrix</CardTitle>
                  <CardDescription>Permission levels for different user roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Feature</TableHead>
                      <TableHead className="text-center">Mall Manager</TableHead>
                      <TableHead className="text-center">Inventory Manager</TableHead>
                      <TableHead className="text-center">Cashier</TableHead>
                      <TableHead className="text-center">Sales Executive</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roleMatrix.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.feature}</TableCell>
                        <TableCell className="text-center">
                          {row.manager ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.inventory ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.cashier ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.sales ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Statistics */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>Current database information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold mt-1">{data.users.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold mt-1">{data.products.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold mt-1">{data.customers.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold mt-1">{data.sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-l-4 border-l-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-destructive" />
              <div>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that reset system data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset Demo Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all data to the initial demo state. All your changes including
                    products, customers, and sales will be lost. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Reset Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
