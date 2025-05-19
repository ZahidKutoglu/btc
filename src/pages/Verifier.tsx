
import { useState } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/lib/mock-data";
import { useUser } from "@/hooks/use-user";
import { Search, UserCheck, QrCode, Shield, AlertCircle } from "lucide-react";
import { CredentialCard } from "@/components/credential-card";

export default function Verifier() {
  const { findUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setSearched(true);
    
    // Simulate network latency
    setTimeout(() => {
      const user = findUser(searchQuery.trim());
      setFoundUser(user);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">BitID Verifier</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Verify the credentials of any BitID user without compromising their privacy or security.
            </p>
          </div>
          
          <Card className="border-2">
            <CardContent className="pt-6">
              <Tabs defaultValue="search">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="search">Search</TabsTrigger>
                  <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="search">
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search by Username or Wallet Address</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="search"
                          placeholder="Enter @username or wallet address"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit" disabled={searching || !searchQuery.trim()}>
                          {searching ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      Try searching for "alexbtc" or "emmabtc"
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="scan" className="flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="p-3 border-2 border-dashed rounded-lg">
                    <div className="w-48 h-48 bg-muted flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Position a QR code in front of your camera to scan
                  </p>
                  <Button>Scan QR Code</Button>
                </TabsContent>
              </Tabs>
              
              {searched && (
                <div className="border-t mt-6 pt-6">
                  {foundUser ? (
                    <div className="animate-scale space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                          <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-center">
                          <h2 className="text-xl font-semibold">{foundUser.name}</h2>
                          <p className="text-muted-foreground">@{foundUser.username}</p>
                        </div>
                      </div>
                      
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <Shield className="h-5 w-5" />
                        <span>This BitID has been successfully verified</span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Verified Credentials</h3>
                        <div className="space-y-3">
                          {foundUser.credentials.length > 0 ? (
                            foundUser.credentials.map((credential) => (
                              <CredentialCard key={credential.id} credential={credential} compact />
                            ))
                          ) : (
                            <div className="text-center p-6 bg-muted/50 rounded-lg">
                              <p className="text-muted-foreground">No credentials found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 animate-scale">
                      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      </div>
                      <h2 className="text-xl font-semibold mb-1">No Results Found</h2>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find a BitID matching "{searchQuery}"
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSearched(false);
                        }}
                      >
                        Try Another Search
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold mb-2">About Verification</h3>
            <p className="text-sm text-muted-foreground">
              BitID verifications are performed trustlessly through cryptographic proofs on the Bitcoin blockchain. 
              Each credential has been cryptographically signed by the issuer and can be verified without revealing sensitive information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
