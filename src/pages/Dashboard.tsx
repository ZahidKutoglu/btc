
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import { CredentialCard } from "@/components/credential-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import { Link } from "react-router-dom";
import { Copy, QrCode, Share, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const copyUserIdentifier = () => {
    navigator.clipboard.writeText(`@${user.username}`);
    toast.success("BitID username copied to clipboard");
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
    toast.success("Wallet address copied to clipboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your BitID</CardTitle>
                <CardDescription>Manage your decentralized identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Overview */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{user.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      @{user.username}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={copyUserIdentifier}
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy username</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="p-3 bg-muted/60 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Wallet Address</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-mono truncate">
                      {user.walletAddress.slice(0, 12)}...
                      {user.walletAddress.slice(-6)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={copyWalletAddress}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  {user.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span>{user.email}</span>
                    </div>
                  )}
                  {user.twitter && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Twitter</span>
                      <span>{user.twitter}</span>
                    </div>
                  )}
                  {user.github && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Github</span>
                      <span>{user.github}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2">
                    <QrCode className="h-4 w-4" />
                    Show QR
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>

                <Button variant="default" asChild className="w-full">
                  <Link to="/settings">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Button asChild>
                <Link to="/issue">
                  <Plus className="h-4 w-4 mr-2" />
                  Issue Credential
                </Link>
              </Button>
            </div>

            <Tabs defaultValue="credentials">
              <TabsList className="mb-4">
                <TabsTrigger value="credentials">
                  Credentials ({user.credentials.length})
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="credentials" className="space-y-6">
                {user.credentials.length === 0 ? (
                  <Card className="border-dashed">
                    <CardHeader className="text-center">
                      <CardTitle>No Credentials Yet</CardTitle>
                      <CardDescription>
                        You haven't issued any credentials for your identity yet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Button asChild>
                        <Link to="/issue">
                          <Plus className="h-4 w-4 mr-2" />
                          Issue Your First Credential
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.credentials.map((credential) => (
                      <CredentialCard key={credential.id} credential={credential} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/60 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <QrCode className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Identity Created</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {user.credentials.map((credential) => (
                        <div key={credential.id} className="flex items-center gap-3 p-3 bg-muted/60 rounded-lg">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Plus className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Added "{credential.name}" credential
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(credential.issuedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
