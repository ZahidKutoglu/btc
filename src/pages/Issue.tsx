
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { credentialTemplates } from "@/lib/mock-data";
import { toast } from "sonner";
import { ArrowLeft, Info, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Issue() {
  const { user, addCredential } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    issuer: "BitID Verification Service",
    metadata: {},
    type: "",
    icon: "",
  });

  // Protect route - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleTemplateSelect = (templateType: string) => {
    const template = credentialTemplates.find((t) => t.type === templateType);
    if (template) {
      setSelectedTemplate(templateType);
      setFormData({
        name: template.name,
        description: template.description,
        issuer: template.issuer,
        metadata: template.metadata,
        type: template.type,
        icon: template.icon,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIssuerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, issuer: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to issue credentials");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate blockchain transaction and verification
    setTimeout(() => {
      try {
        addCredential(user.id, formData);
        setIsSubmitting(false);
        setIsSuccess(true);
        
        toast.success("Credential issued successfully");
        
        // Reset form after showing success
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        toast.error("Failed to issue credential. Please try again.");
        setIsSubmitting(false);
      }
    }, 2000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Issue Credential</h1>
            <p className="text-muted-foreground mt-2">
              Create a new verifiable credential for your BitID
            </p>
          </div>
          
          {isSuccess ? (
            <Card className="border-2 border-green-500">
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Credential Issued!</h2>
                <p className="text-muted-foreground mb-6">
                  Your new credential has been successfully created and added to your BitID
                </p>
                <Button asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Issue a New Credential</CardTitle>
                <CardDescription>
                  Select a credential template or create a custom one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label htmlFor="template">Select a Template</Label>
                  <Select onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentialTemplates.map((template) => (
                        <SelectItem key={template.type} value={template.type}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="name">Credential Name</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The name of your credential as it will appear to verifiers</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="description">Description</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Additional details about what this credential represents</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="issuer">Issuer</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>The entity that is issuing this credential</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select onValueChange={handleIssuerChange} defaultValue={formData.issuer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issuer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BitID Verification Service">BitID Verification Service</SelectItem>
                        <SelectItem value="Educational Institution">Educational Institution</SelectItem>
                        <SelectItem value="Employer">Employer</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Self-Issued">Self-Issued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium mb-1">Verification Note</div>
                        <p className="text-muted-foreground">
                          In a real system, these credentials would be cryptographically signed and verified on the Bitcoin blockchain.
                          For this demo, all issued credentials are automatically verified.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedTemplate}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Issuing Credential...
                    </>
                  ) : "Issue Credential"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
