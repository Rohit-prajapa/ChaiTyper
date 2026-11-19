import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser as loginAPI,
  registerUser as registerAPI,
  logoutUser as logoutAPI,
  updateProfile as updateProfileAPI,
  type AuthUser,
  type LoginData,
  type RegisterData,
  type UpdateProfileData,
} from "../services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing login session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();

        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register
  const register = async (data: RegisterData) => {
    const response = await registerAPI(data);

    if (!response.success || !response.user) {
      throw new Error(response.message || "Registration failed");
    }

    setUser(response.user);
  };

  // Login
  const login = async (data: LoginData) => {
    const response = await loginAPI(data);

    if (!response.success || !response.user) {
      throw new Error(response.message || "Login failed");
    }

    setUser(response.user);
  };

  // Logout
  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  // Update profile
  const updateProfile = async (data: UpdateProfileData) => {
    const response = await updateProfileAPI(data);

    if (!response.success || !response.user) {
      throw new Error(response.message || "Profile update failed");
    }

    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
