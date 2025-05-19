
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  walletAddress: string;
  twitter?: string;
  github?: string;
  avatar?: string;
  createdAt: Date;
  credentials: Credential[];
}

export interface Credential {
  id: string;
  type: string;
  name: string;
  description: string;
  issuedAt: Date;
  expiresAt?: Date;
  issuer: string;
  status: 'active' | 'expired' | 'revoked';
  verified: boolean;
  metadata: Record<string, any>;
  icon: string;
}

export const defaultUsers: User[] = [
  {
    id: "u_1",
    name: "Alex Johnson",
    username: "alexbtc",
    email: "alex@example.com",
    walletAddress: "bc1q9h805z6vkn87zx584ngnj88tn4vsp7hdzwqf45",
    twitter: "@alexbtc",
    github: "alexbtc",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    createdAt: new Date('2023-01-15'),
    credentials: [
      {
        id: "c_1",
        type: "EmailVerification",
        name: "Verified Email",
        description: "This credential verifies the ownership of an email address",
        issuedAt: new Date('2023-01-15'),
        issuer: "BitID Verification Service",
        status: 'active',
        verified: true,
        metadata: { email: "alex@example.com" },
        icon: "mail-check"
      },
      {
        id: "c_2",
        type: "KYCVerification",
        name: "KYC Level 1",
        description: "This user has completed basic Know Your Customer verification",
        issuedAt: new Date('2023-02-10'),
        issuer: "BitID Verification Service",
        status: 'active',
        verified: true,
        metadata: { level: 1, method: "document" },
        icon: "shield-check"
      }
    ]
  },
  {
    id: "u_2",
    name: "Emma Smith",
    username: "emmabtc",
    email: "emma@example.com",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    twitter: "@emmasmith",
    createdAt: new Date('2023-03-20'),
    credentials: [
      {
        id: "c_3",
        type: "EmailVerification",
        name: "Verified Email",
        description: "This credential verifies the ownership of an email address",
        issuedAt: new Date('2023-03-20'),
        issuer: "BitID Verification Service",
        status: 'active',
        verified: true,
        metadata: { email: "emma@example.com" },
        icon: "mail-check"
      },
      {
        id: "c_4",
        type: "EducationCredential",
        name: "University Degree",
        description: "Bachelor of Computer Science from Tech University",
        issuedAt: new Date('2023-04-15'),
        issuer: "Tech University",
        status: 'active',
        verified: true,
        metadata: { 
          degree: "Bachelor of Computer Science",
          university: "Tech University",
          graduationYear: "2022"
        },
        icon: "graduation-cap"
      }
    ]
  }
];

export const credentialTemplates: Omit<Credential, 'id' | 'issuedAt' | 'status' | 'verified'>[] = [
  {
    type: "EmailVerification",
    name: "Verified Email",
    description: "Verify ownership of an email address",
    issuer: "BitID Verification Service",
    metadata: {},
    icon: "mail-check"
  },
  {
    type: "KYCVerification",
    name: "KYC Level 1",
    description: "Basic Know Your Customer verification",
    issuer: "BitID Verification Service",
    metadata: { level: 1 },
    icon: "shield-check"
  },
  {
    type: "EducationCredential",
    name: "University Degree",
    description: "Verify an academic degree from an educational institution",
    issuer: "Educational Institution",
    metadata: {},
    icon: "graduation-cap"
  },
  {
    type: "EmploymentCredential",
    name: "Employment Verification",
    description: "Verify current or past employment",
    issuer: "Employer",
    metadata: {},
    icon: "briefcase"
  }
];

// Mock localStorage data handling
const STORAGE_KEY = "bitid_data";

export function saveData(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function loadData(): User[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveData(defaultUsers);
    return defaultUsers;
  }
  return JSON.parse(data);
}

// Initialize
loadData();
