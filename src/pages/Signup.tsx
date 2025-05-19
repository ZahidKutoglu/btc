
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletConnect } from "@/components/wallet-connect";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";

export default function Signup() {
  const { signup } = useUser();
  const navigate = useNavigate();
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    twitter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setWalletConnected(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!formData.name || !formData.username) {
      toast.error("Name and username are required");
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
    
    try {
      signup({
        ...formData,
        walletAddress,
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your BitID</CardTitle>
              <CardDescription>
                Connect your wallet and set up your decentralized identity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!walletConnected ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">First, connect your Bitcoin wallet</p>
                    <WalletConnect 
                      onConnect={handleWalletConnect} 
                      className="w-full"
                    />
                  </div>
                  
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 flex p-3 rounded-md text-sm">
                    <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>Your identity will be linked to your Bitcoin wallet address for secure authentication</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-md text-sm flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2" />
                    <span>Wallet connected successfully!</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      placeholder="johndoe" 
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be your BitID username
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter Handle (optional)</Label>
                    <Input 
                      id="twitter" 
                      name="twitter"
                      placeholder="@johnbtc" 
                      value={formData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create BitID"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pt-0">
              <p className="text-xs text-muted-foreground text-center">
                By creating a BitID, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
