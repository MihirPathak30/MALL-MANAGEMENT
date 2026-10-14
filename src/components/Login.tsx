import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getData, setSession, User } from "@/utils/storage";
import { toast } from "sonner";
import { Store, Lock, User as UserIcon } from "lucide-react";

const roleOptions = [
  { value: "manager", label: "Mall Manager", username: "manager", password: "1234" },
  { value: "inventory", label: "Inventory Manager", username: "inventory", password: "1234" },
  { value: "cashier", label: "Cashier", username: "cashier", password: "1234" },
  { value: "sales", label: "Sales Executive", username: "sales", password: "1234" },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (roleValue: string) => {
    const role = roleOptions.find(r => r.value === roleValue);
    if (role) {
      setSelectedRole(roleValue);
      setUsername(role.username);
      setPassword(role.password);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = getData();
    const user = data.users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setSession(user);
      toast.success(`Welcome ${user.role}!`);
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-4 bg-white rounded-2xl shadow-strong">
              <Store className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-3">
              Mall Management
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete business solution for modern retail management
            </p>
          </div>
          <div className="space-y-3 text-left bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-medium">
            <h3 className="font-semibold text-lg mb-4">Quick Access Roles:</h3>
            {roleOptions.map((role) => (
              <div key={role.value} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-medium">{role.label}</span>
                <span className="text-xs">({role.username})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-strong border-0 animate-scale-in">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Select your role to auto-fill credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((role) => (
                    <Button
                      key={role.value}
                      type="button"
                      variant={selectedRole === role.value ? "default" : "outline"}
                      className="h-auto py-3 px-4 justify-start"
                      onClick={() => handleRoleSelect(role.value)}
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      <span className="text-sm">{role.label.split(" ")[0]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-11" size="lg">
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo credentials: All passwords are "1234"
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
