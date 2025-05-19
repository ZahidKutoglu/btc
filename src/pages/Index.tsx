
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { 
  ShieldCheck, 
  UserCheck, 
  Fingerprint, 
  CheckCircle,
  ArrowRight,
  LockKeyhole
} from "lucide-react";

export default function Index() {
  const { user } = useUser();

  const features = [
    {
      icon: <UserCheck className="h-6 w-6 text-bitcoin-primary" />,
      title: "Create Identity",
      description: "Connect your Bitcoin wallet and establish a secure, decentralized identity",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-bitcoin-primary" />,
      title: "Issue Credentials",
      description: "Generate verifiable credentials that are cryptographically secured",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-bitcoin-primary" />,
      title: "Verify Identity",
      description: "Easily verify anyone's credentials with full privacy protection",
    },
    {
      icon: <LockKeyhole className="h-6 w-6 text-bitcoin-primary" />,
      title: "Login with BitID",
      description: "Use your decentralized identity to access services securely",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-light/20 to-bitcoin-primary/5 dark:from-bitcoin-primary/10 dark:to-bitcoin-dark/40 -z-10" />
          <div className="container py-16 md:py-24">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="md:max-w-2xl space-y-6 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                  Your <span className="text-gradient">Decentralized Identity</span> on Bitcoin
                </h1>
                <p className="text-lg text-muted-foreground">
                  BitID gives you control over your digital identity. Create verifiable credentials, protect your privacy, and securely verify identities without centralized authorities.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  {user ? (
                    <Button size="lg" asChild>
                      <Link to="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" asChild>
                      <Link to="/signup">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/verifier">Verify Identity</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-bitcoin-primary to-bitcoin-accent opacity-30 blur-sm"></div>
                <div className="glass dark:bg-bitcoin-dark/50 p-6 rounded-2xl relative">
                  <div className="w-full max-w-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-gradient-to-r from-bitcoin-primary to-bitcoin-accent rounded">
                          <Fingerprint className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-sm">BitID Profile</span>
                      </div>
                      <div className="bg-green-100 dark:bg-green-500/20 px-2 py-0.5 text-xs font-medium rounded-full text-green-800 dark:text-green-400">
                        Verified
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 bg-background/60 dark:bg-background/20 rounded">
                        <div className="text-xs text-muted-foreground">Name</div>
                        <div className="font-medium">Alex Johnson</div>
                      </div>
                      <div className="p-3 bg-background/60 dark:bg-background/20 rounded">
                        <div className="text-xs text-muted-foreground">BitID</div>
                        <div className="font-medium">@alexbtc</div>
                      </div>
                      <div className="p-3 bg-background/60 dark:bg-background/20 rounded">
                        <div className="text-xs text-muted-foreground">Wallet</div>
                        <div className="font-medium truncate">bc1q9h...qf45</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium mb-1">Verified Credentials</div>
                      <div className="bg-green-100 dark:bg-green-500/20 p-2 rounded flex items-center gap-2">
                        <div className="p-1 rounded bg-green-500/20">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-xs text-green-800 dark:text-green-400">Email Verification</span>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-500/20">
                          <ShieldCheck className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-xs text-blue-800 dark:text-blue-400">KYC Level 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">How BitID Works</h2>
              <p className="text-muted-foreground">
                BitID provides a secure, self-sovereign identity system built on Bitcoin that gives you complete control over your personal information.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                  style={{
                    animation: `fade-in 0.3s ease-out ${index * 0.1}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="p-3 bg-primary/10 w-fit rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="bg-gradient-to-r from-bitcoin-primary/10 to-bitcoin-accent/10 dark:from-bitcoin-primary/20 dark:to-bitcoin-accent/20 p-8 md:p-12 rounded-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to take control of your identity?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands who are already using BitID to secure their digital identity and verify credentials without giving up their privacy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Button size="lg" asChild>
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button size="lg" asChild>
                    <Link to="/signup">Create Your BitID</Link>
                  </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                  <Link to="/verifier">Try Verification</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="p-1 bg-gradient-primary rounded">
                  <Fingerprint className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-lg">BitID</span>
              </div>
              <div className="text-sm text-muted-foreground">
                © 2025 BitID. All rights reserved. Demonstration purposes only.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
