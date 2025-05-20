'use client';

declare global {
  interface Window {
    StacksProvider?: any;
  }
}


import { useState, useEffect } from "react";
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
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { showConnect } from '@stacks/connect';
import { userSession } from '@/lib/stacks'

interface WalletConnectProps {
  onConnect: (userData: any) => void;
  onDisconnect?: () => void;
  buttonText?: string;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
}

export function WalletConnect({ 
  onConnect, 
  onDisconnect,
  buttonText = "Connect Wallet", 
  variant = "default",
  className = ""
}: WalletConnectProps) {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false); // New state for disconnecting
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLeatherInstalled, setIsLeatherInstalled] = useState(false);

  useEffect(() => {
    const checkLeatherInstalled = () => {
      const isInstalled = !!window.StacksProvider;
      setIsLeatherInstalled(isInstalled);
      return isInstalled;
    };

    checkLeatherInstalled();

    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      setUserData(data);
      onConnect(data);
    } else if (userSession.isSignInPending()) {
      setConnecting(true);
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
        onConnect(data);
        setConnecting(false);
      });
    }
  }, [onConnect]);

  const handleConnect = () => {
    setConnecting(true);
    setError(null);
    
    showConnect({
      appDetails: {
        name: 'Bitcoin Passport',
        icon: window.location.origin + '/icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const data = userSession.loadUserData();
        setUserData(data);
        onConnect(data);
        setConnecting(false);
        setOpen(false);
        toast.success("Wallet connected successfully");
      },
      onCancel: () => {
        setConnecting(false);
        setError("Connection cancelled by user");
      },
      userSession,
    });
  };

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true); // Set disconnecting state
      await userSession.signUserOut();
      setUserData(null);
      setOpen(false); // Close the dialog
      if (onDisconnect) onDisconnect();
      toast.info("Wallet disconnected");
    } catch (err) {
      console.error("Disconnect error:", err);
      toast.error("Failed to disconnect wallet");
    } finally {
      setDisconnecting(false); // Reset disconnecting state
    }
  };

  const copyToClipboard = () => {
    if (!userData?.profile?.stxAddress?.mainnet) return;
    navigator.clipboard.writeText(userData.profile.stxAddress.mainnet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const installLeather = () => {
    window.open('https://leather.io/install-extension', '_blank');
  };

  return (
    <>
      <Button 
        variant={variant} 
        className={`${className}`}
        onClick={() => userData ? handleDisconnect() : setOpen(true)}
        disabled={connecting || disconnecting} // Disable during both connect/disconnect
      >
        <Wallet className="mr-2 h-4 w-4" />
        {userData ? 
          (disconnecting ? "Disconnecting..." : "Disconnect Wallet") : 
          (connecting ? "Connecting..." : buttonText)}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{userData ? "Wallet Connected" : "Connect your wallet"}</DialogTitle>
            <DialogDescription>
              {userData ? (
                "Your wallet is successfully connected."
              ) : (
                "Connect your Bitcoin wallet to create or access your decentralized identity."
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-0.5">
            {userData ? (
              <div className="border border-border bg-secondary/30 rounded-lg p-4 w-full mb-4 max-w-full">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Leather Wallet</p>
                  <div className="p-1.5 rounded-md bg-green-500/20 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <div className="bg-black p-2 rounded">
                    <QrCode className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 truncate text-sm px-2 py-1 rounded bg-muted max-w-[200px]">
                    {shortenAddress(userData.profile.stxAddress?.mainnet)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 flex-shrink-0"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  {disconnecting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                      Disconnecting...
                    </>
                  ) : "Disconnect Wallet"}
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-gradient-primary p-4 rounded-xl mb-4">
                  <Bitcoin className="h-10 w-10 text-white animate-pulse-slow" />
                </div>
                
                {!isLeatherInstalled ? (
                  <div className="w-full space-y-4">
                    <div className="bg-yellow-500/10 text-yellow-600 flex items-center gap-2 p-3 rounded-lg">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm">Leather wallet extension not detected</p>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={installLeather}
                    >
                      Install Leather Wallet
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="border border-border bg-secondary/30 rounded-lg p-4 w-full mb-4 max-w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Leather Wallet</p>
                        <div className="p-1.5 rounded-md bg-gray-500/20 text-gray-600">
                          <div className="h-2 w-2 rounded-full bg-gray-600" />
                        </div>
                      </div>
                      
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click connect to authenticate with your Leather wallet
                      </p>
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
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}