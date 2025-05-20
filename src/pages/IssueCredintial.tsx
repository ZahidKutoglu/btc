import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckIcon, MailIcon, FileTextIcon, HomeIcon, GraduationCapIcon, Loader2 } from "lucide-react";
import { Header } from "@/components/header";

type CredentialStatus = 'unverified' | 'pending' | 'verified';

type CredentialType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: CredentialStatus;
  verifiedData?: any;
};

export default function IssueCredential() {
  const navigate = useNavigate();
  
  const [activeCredential, setActiveCredential] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<CredentialType[]>([
    {
      id: 'email',
      title: 'Verified Email',
      description: 'Verify your email address',
      icon: <MailIcon className="h-5 w-5" />,
      status: 'unverified'
    },
    {
      id: 'governmentId',
      title: 'Government ID',
      description: 'Upload your government issued ID',
      icon: <FileTextIcon className="h-5 w-5" />,
      status: 'unverified'
    },
    {
      id: 'address',
      title: 'Proof of Address',
      description: 'Verify your residential address',
      icon: <HomeIcon className="h-5 w-5" />,
      status: 'unverified'
    },
    {
      id: 'degree',
      title: 'University Degree',
      description: 'Verify your academic credentials',
      icon: <GraduationCapIcon className="h-5 w-5" />,
      status: 'unverified'
    }
  ]);
  
  const [formData, setFormData] = useState({
    email: '',
    idName: '',
    idDob: '',
    idFile: null as File | null,
    address: '',
    addressFile: null as File | null,
    university: '',
    degree: '',
    graduationYear: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const verifyCredential = async (credentialId: string) => {
    setIsSubmitting(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCredentials(prev => prev.map(cred => {
        if (cred.id === credentialId) {
          return { ...cred, status: 'verified' };
        }
        return cred;
      }));
      
      toast.success(`${getCredentialTitle(credentialId)} verified successfully!`);
      setActiveCredential(null);
    } catch (error) {
      toast.error(`Failed to verify ${getCredentialTitle(credentialId)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCredentialTitle = (id: string) => {
    return credentials.find(c => c.id === id)?.title || '';
  };

  const renderCredentialForm = () => {
    if (!activeCredential) return null;
    
    switch (activeCredential) {
      case 'email':
        return (
          <div className="space-y-4">
            <Header />
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => verifyCredential('email')}
              disabled={!formData.email || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Verification...
                </>
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Send Verification
                </>
              )}
            </Button>
          </div>
        );
        
      case 'governmentId':
        return (
          <div className="space-y-4">
            <Header />
            <div className="space-y-2">
              <Label htmlFor="idName">Full Name (as on ID)</Label>
              <Input
                id="idName"
                name="idName"
                placeholder="John Doe"
                value={formData.idName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idDob">Date of Birth</Label>
              <Input
                id="idDob"
                name="idDob"
                type="date"
                value={formData.idDob}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idFile">Upload ID Document</Label>
              <Input
                id="idFile"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'idFile')}
              />
              <p className="text-xs text-muted-foreground">
                Upload a clear photo or scan of your government-issued ID
              </p>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => verifyCredential('governmentId')}
              disabled={!formData.idName || !formData.idDob || !formData.idFile || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Verify ID
                </>
              )}
            </Button>
          </div>
        );
        
      case 'address':
        return (
          <div className="space-y-4">
            <Header />
            <div className="space-y-2">
              <Label htmlFor="address">Residential Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City, Country"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressFile">Upload Proof of Address</Label>
              <Input
                id="addressFile"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'addressFile')}
              />
              <p className="text-xs text-muted-foreground">
                Utility bill, bank statement, or official document showing your name and address
              </p>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => verifyCredential('address')}
              disabled={!formData.address || !formData.addressFile || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Verify Address
                </>
              )}
            </Button>
          </div>
        );
        
      case 'degree':
        return (
          <div className="space-y-4">
            <Header />
            <div className="space-y-2">
              <Label htmlFor="university">University Name</Label>
              <Input
                id="university"
                name="university"
                placeholder="University of Example"
                value={formData.university}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                placeholder="Bachelor of Science in Computer Science"
                value={formData.degree}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
                value={formData.graduationYear}
                onChange={handleInputChange}
              />
            </div>
            
            <Button 
              className="w-full"
              onClick={() => verifyCredential('degree')}
              disabled={!formData.university || !formData.degree || !formData.graduationYear || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <GraduationCapIcon className="mr-2 h-4 w-4" />
                  Verify Degree
                </>
              )}
            </Button>
          </div>
        );
        
      default:
        return null;
    }
  };

  const allVerified = credentials.every(c => c.status === 'verified');

  return (
    <div className="min-h-screen flex flex-col">
        <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Issue Credentials</CardTitle>
              <CardDescription>
                Verify your identity to enhance your decentralized profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeCredential ? (
                <div className="space-y-4">
                  {credentials.map((credential) => (
                    <div 
                      key={credential.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                        credential.status === 'verified' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                      onClick={() => credential.status !== 'verified' && setActiveCredential(credential.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            credential.status === 'verified' 
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                              : 'bg-muted'
                          }`}>
                            {credential.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{credential.title}</h3>
                            <p className="text-sm text-muted-foreground">{credential.description}</p>
                          </div>
                        </div>
                        {credential.status === 'verified' ? (
                          <Badge variant="success" className="gap-1">
                            <CheckIcon className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {allVerified && (
                    <Button 
                      className="w-full mt-6"
                      onClick={() => navigate('/dashboard')}
                    >
                      Continue to Dashboard
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <button 
                      onClick={() => setActiveCredential(null)}
                      className="p-1 rounded-full hover:bg-muted"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                      </svg>
                    </button>
                    <h3 className="font-medium text-lg">{getCredentialTitle(activeCredential)}</h3>
                  </div>
                  
                  {renderCredentialForm()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}