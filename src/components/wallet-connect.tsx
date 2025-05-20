
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Bitcoin, 
  QrCode, 
  Copy, 
  Check,
  Wallet,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface WalletConnectProps {
  onConnect: (walletAddress: string) => void;
  buttonText?: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
}

export function WalletConnect({ 
  onConnect, 
  buttonText = "Connect Wallet", 
  variant = "default",
  className = ""
}: WalletConnectProps) {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock wallet address
  const mockAddress = "bc1q9h805z6vkn87zx584ngnj88tn4vsp7hdzwqf45";

  const handleConnect = () => {
    setConnecting(true);
    setError(null);
    
    // Simulate connection delay
    setTimeout(() => {
      setConnecting(false);
      
      // Small chance of connection error for realism
      if (Math.random() > 0.9) {
        setError("Connection failed. Please try again.");
        return;
      }
      
      onConnect(mockAddress);
      setOpen(false);
      toast.success("Wallet connected successfully");
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mockAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button 
        variant={variant} 
        className={`${className}`}
        onClick={() => setOpen(true)}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
            <DialogDescription>
              Connect your Bitcoin wallet to create or access your decentralized identity.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <div className="bg-gradient-primary p-4 rounded-xl mb-4">
              <Bitcoin className="h-10 w-10 text-white animate-pulse-slow" />
            </div>
            
            <div className="border border-border bg-secondary/30 rounded-lg p-4 w-full mb-4 max-w-full">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Mock Bitcoin Wallet</p>
                <div className="p-1.5 rounded-md bg-green-500/20 text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="bg-black p-2 rounded">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div className=" truncate text-sm px-2 py-1 rounded bg-muted">
                  {mockAddress}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 flex-shrink"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="bg-destructive/10 text-destructive flex items-center gap-2 p-3 rounded-lg w-full mb-4">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : "Connect Wallet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
