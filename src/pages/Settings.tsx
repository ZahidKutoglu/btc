
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { useUser } from "@/hooks/use-user";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user, updateUser } = useUser();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    twitter: "",
    github: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Initialize form with user data
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      twitter: user.twitter || "",
      github: user.github || "",
    });
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update settings");
      return;
    }
    
    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast.error("Username can only contain letters, numbers and underscores");
      return;
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      try {
        updateUser(user.id, formData);
        toast.success("Settings updated successfully");
        setIsSubmitting(false);
      } catch (error) {
        toast.error("Failed to update settings");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your BitID profile and application preferences
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and BitID profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your public BitID username (letters, numbers, underscores only)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter Handle</Label>
                    <Input 
                      id="twitter" 
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Username</Label>
                    <Input 
                      id="github" 
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how BitID looks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Theme</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Wallet Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet</CardTitle>
                <CardDescription>
                  Manage your connected Bitcoin wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/60 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Connected Wallet</div>
                  <div className="font-mono text-sm">
                    {user.walletAddress}
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg text-sm">
                  <p>
                    Your identity is cryptographically linked to this wallet address.
                    Changing wallets is not supported in this demo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
