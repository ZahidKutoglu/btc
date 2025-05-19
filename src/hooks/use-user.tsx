
import { createContext, useState, useContext, useEffect } from "react";
import { User, loadData, saveData } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  user: User | null;
  users: User[];
  login: (walletAddress: string) => boolean;
  signup: (userData: Partial<User>) => User;
  logout: () => void;
  findUser: (identifier: string) => User | null;
  addCredential: (userId: string, credential: any) => User | null;
  updateUser: (userId: string, userData: Partial<User>) => User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load users from local storage
    const loadedUsers = loadData();
    setUsers(loadedUsers);
    
    // Check for logged in user
    const loggedInUserId = localStorage.getItem("bitid_current_user");
    if (loggedInUserId) {
      const loggedInUser = loadedUsers.find(u => u.id === loggedInUserId);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
    }
  }, []);

  const login = (walletAddress: string): boolean => {
    const foundUser = users.find(u => u.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("bitid_current_user", foundUser.id);
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "No account found with this wallet address",
      variant: "destructive",
    });
    return false;
  };

  const signup = (userData: Partial<User>): User => {
    if (!userData.walletAddress) {
      throw new Error("Wallet address is required");
    }

    // Check if user already exists
    const existingUser = users.find(u => u.walletAddress.toLowerCase() === userData.walletAddress!.toLowerCase());
    if (existingUser) {
      toast({
        title: "Account already exists",
        description: "This wallet address is already registered",
        variant: "destructive",
      });
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name: userData.name || "Anonymous",
      username: userData.username || `user_${Date.now().toString(36)}`,
      email: userData.email || "",
      walletAddress: userData.walletAddress,
      twitter: userData.twitter || "",
      github: userData.github || "",
      avatar: userData.avatar || "",
      createdAt: new Date(),
      credentials: [],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    saveData(updatedUsers);
    localStorage.setItem("bitid_current_user", newUser.id);
    
    toast({
      title: "Account created",
      description: "Your BitID has been created successfully!",
    });
    
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bitid_current_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const findUser = (identifier: string): User | null => {
    return users.find(
      u => 
        u.id === identifier || 
        u.username.toLowerCase() === identifier.toLowerCase() || 
        u.walletAddress.toLowerCase() === identifier.toLowerCase()
    ) || null;
  };

  const addCredential = (userId: string, credentialData: any): User | null => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const credential = {
      id: `c_${Date.now()}`,
      type: credentialData.type,
      name: credentialData.name,
      description: credentialData.description,
      issuedAt: new Date(),
      issuer: credentialData.issuer,
      status: 'active' as const,
      verified: true,
      metadata: credentialData.metadata || {},
      icon: credentialData.icon,
      ...(credentialData.expiresAt && { expiresAt: credentialData.expiresAt }),
    };
    
    const updatedUser = {
      ...users[userIndex],
      credentials: [...users[userIndex].credentials, credential]
    };
    
    const updatedUsers = [
      ...users.slice(0, userIndex),
      updatedUser,
      ...users.slice(userIndex + 1)
    ];
    
    setUsers(updatedUsers);
    saveData(updatedUsers);
    
    if (user && user.id === userId) {
      setUser(updatedUser);
    }
    
    return updatedUser;
  };

  const updateUser = (userId: string, userData: Partial<User>): User | null => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    const updatedUser = {
      ...users[userIndex],
      ...userData,
    };
    
    const updatedUsers = [
      ...users.slice(0, userIndex),
      updatedUser,
      ...users.slice(userIndex + 1)
    ];
    
    setUsers(updatedUsers);
    saveData(updatedUsers);
    
    if (user && user.id === userId) {
      setUser(updatedUser);
    }
    
    return updatedUser;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      signup, 
      logout, 
      findUser,
      addCredential,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
