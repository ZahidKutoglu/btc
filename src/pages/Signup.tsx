import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletConnect } from "@/components/wallet-connect";
import { toast } from "sonner";
import { InfoIcon } from "lucide-react";
import { auth, db } from "@/lib/firebase"; // Make sure you have firebase configured
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const navigate = useNavigate();
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    twitter: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWalletConnect = (userData: any) => {
    const address = userData?.profile?.stxAddress?.mainnet;
    if (address) {
      setWalletAddress(address);
      setWalletConnected(true);
      toast.success("Wallet connected successfully");
    } else {
      toast.error("Failed to get wallet address");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    // Form validation
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      toast.error("Username can only contain letters, numbers and underscores");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // 2. Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        username: formData.username.toLowerCase(),
        email: formData.email,
        twitter: formData.twitter.startsWith('@') 
          ? formData.twitter 
          : `@${formData.twitter}`,
        walletAddress: walletAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 3. Optional: Create a public profile document
      await setDoc(doc(db, "publicProfiles", formData.username.toLowerCase()), {
        uid: user.uid,
        name: formData.name,
        username: formData.username.toLowerCase(),
        twitter: formData.twitter.startsWith('@') 
          ? formData.twitter 
          : `@${formData.twitter}`,
        walletAddress: walletAddress,
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create account";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "firestore/permission-denied":
          errorMessage = "Database error. Please try again.";
          break;
      }
      
      toast.error(errorMessage);
    } finally {
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
                    <span>Wallet connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="username">Username *</Label>
                    <Input 
                      id="username" 
                      name="username"
                      placeholder="johndoe" 
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers and underscores only. This will be your public BitID.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="john@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="••••••" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      At least 6 characters
                    </p>
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
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Creating...</span>
                        <span className="animate-spin">↻</span>
                      </>
                    ) : "Create BitID"}
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