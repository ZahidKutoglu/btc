
import { useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/wallet-connect";
import { useUser } from "@/hooks/use-user";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const { login, user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  if (user) {
    navigate("/dashboard");
    return null;
  }

  const handleWalletConnect = (walletAddress: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const success = login(walletAddress);
      setIsLoading(false);
      
      if (success) {
        navigate("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login to BitID</CardTitle>
              <CardDescription>
                Connect your wallet to access your decentralized identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Connect your Bitcoin wallet to continue</p>
                <WalletConnect 
                  onConnect={handleWalletConnect} 
                  onDisconnect={() => setIsLoading(false)}
                  buttonText={isLoading ? "Connecting..." : "Connect Wallet"} 
                  className="w-full"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/verifier">
                  Verify an Identity
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground">
                  Don't have a BitID yet?{" "}
                  <Link to="/signup" className="text-primary font-medium hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
