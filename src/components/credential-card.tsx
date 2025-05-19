
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Credential } from "@/lib/mock-data";
import { Check, InfoIcon, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CredentialCardProps {
  credential: Credential;
  compact?: boolean;
}

export function CredentialCard({ credential, compact = false }: CredentialCardProps) {
  const getStatusInfo = () => {
    switch (credential.status) {
      case 'active':
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          text: "Valid",
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        };
      case 'expired':
        return {
          icon: <Clock className="h-4 w-4 text-amber-600" />,
          text: "Expired",
          color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        };
      case 'revoked':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          text: "Revoked",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        };
      default:
        return {
          icon: <InfoIcon className="h-4 w-4 text-blue-600" />,
          text: "Unknown",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        };
    }
  };

  const statusInfo = getStatusInfo();
  
  // Match icon name to Lucide icon (simplified)
  const getIcon = () => {
    let IconComponent;
    try {
      // Simple mapping for demo purposes
      switch(credential.icon) {
        case 'mail-check':
          return <Check className="h-5 w-5" />;
        case 'shield-check':
          return <Check className="h-5 w-5" />;
        case 'graduation-cap':
          return <Check className="h-5 w-5" />;
        case 'briefcase':
          return <Check className="h-5 w-5" />;
        default:
          return <Check className="h-5 w-5" />;
      }
    } catch (error) {
      return <Check className="h-5 w-5" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary/80 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-sm font-medium">{credential.name}</h4>
            <p className="text-xs text-muted-foreground">{credential.issuer}</p>
          </div>
        </div>
        <Badge variant="outline" className={statusInfo.color}>
          {statusInfo.icon}
          <span className="ml-1 text-xs">{statusInfo.text}</span>
        </Badge>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                {getIcon()}
              </div>
              <CardTitle className="text-lg">{credential.name}</CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={statusInfo.color}>
                  {statusInfo.icon}
                  <span className="ml-1">{statusInfo.text}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {statusInfo.text === "Valid" ? "This credential is active and verified" : 
                 statusInfo.text === "Expired" ? "This credential has expired" :
                 "This credential has been revoked"}
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription>{credential.description}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issuer</span>
              <span className="font-medium">{credential.issuer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issued</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(credential.issuedAt), { addSuffix: true })}
              </span>
            </div>
            {credential.expiresAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(credential.expiresAt), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          {credential.verified && (
            <div className="w-full flex items-center justify-between bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs py-1.5 px-3 rounded-md">
              <span>Cryptographically verified</span>
              <Check className="h-3.5 w-3.5" />
            </div>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
