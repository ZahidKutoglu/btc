import { useState, useCallback, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserCheck, QrCode, Shield, AlertCircle } from "lucide-react";
import { CredentialCard } from "@/components/credential-card";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Verifier() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const scannerRef = useRef(null);

  // Check camera permissions when component mounts
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (err) {
        setHasCameraPermission(false);
        setError("Camera access denied. Please enable camera permissions.");
      }
    };

    if (scanning) {
      checkCameraPermission();
    }
  }, [scanning]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearched(true);
    setError(null);

    try {
      const searchTerm = searchQuery.trim().toLowerCase();
      let userDoc = null;

      if (searchTerm.startsWith("@")) {
        const username = searchTerm.slice(1);
        const q = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          userDoc = { id: docSnap.id, ...docSnap.data() };
        }
      } else {
        const docRef = doc(db, "users", searchTerm);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          userDoc = { id: docSnap.id, ...docSnap.data() };
        }
      }

      setFoundUser(userDoc);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const handleScan = useCallback((result: string) => {
    if (!result) return;
    
    setScanning(false);
    setSearchQuery(result);
    // The actual search will be triggered by the searchQuery change effect
  }, []);

  const handleError = useCallback((err: Error) => {
    console.error(err);
    setError(`Camera error: ${err.message}`);
    setScanning(false);
  }, []);

  const toggleCamera = useCallback(() => {
    setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  // Trigger search when QR code is scanned
  useEffect(() => {
    if (searchQuery && searched) {
      const searchEvent = new Event('submit', { cancelable: true });
      const form = document.querySelector('form');
      form?.dispatchEvent(searchEvent);
    }
  }, [searchQuery, searched]);

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
                      <Label htmlFor="search">Search by @username or Wallet Address</Label>
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
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      Try searching for "@alexbtc" or entering a wallet address
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="scan" className="flex flex-col items-center justify-center space-y-4 py-8">
                  {scanning ? (
                    <>
                      {hasCameraPermission === false ? (
                        <div className="text-center p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                          <p className="text-red-600">Camera access denied. Please enable camera permissions in your browser settings.</p>
                          <Button className="mt-4" onClick={() => setScanning(false)}>
                            Back
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="w-full max-w-md aspect-square relative">
                            <Scanner
                              ref={scannerRef}
                              onResult={(result) => result?.getText() && handleScan(result.getText())}
                              onError={handleError}
                              constraints={{
                                facingMode: cameraFacingMode,
                                video: { width: { ideal: 1280 }, height: { ideal: 720 } }
                              }}
                              containerStyle={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '0.5rem',
                                overflow: 'hidden',
                              }}
                              videoStyle={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <div className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none" />
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={toggleCamera}>
                              Switch Camera
                            </Button>
                            <Button variant="destructive" onClick={() => setScanning(false)}>
                              Cancel Scan
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="p-3 border-2 border-dashed rounded-lg">
                        <div className="w-48 h-48 bg-muted flex items-center justify-center">
                          <QrCode className="h-16 w-16 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Position a QR code in front of your camera to scan
                      </p>
                      <Button onClick={() => setScanning(true)}>
                        Start Scanning
                      </Button>
                    </>
                  )}
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
                          {foundUser.credentials?.length > 0 ? (
                            foundUser.credentials.map((credential: any) => (
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
                          setFoundUser(null);
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