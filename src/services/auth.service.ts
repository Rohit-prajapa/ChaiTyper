import api from "./api";

// Register data
export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

// Login data
export interface LoginData {
  email?: string;
  username?: string;
  password: string;
}

// User details
export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
}

// API response
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
}

// Update profile data
export interface UpdateProfileData {
  fullName: string;
  username: string;
}

// Register user
export const registerUser = async (data: RegisterData) => {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
};

// Login user
export const loginUser = async (data: LoginData) => {
  const response = await api.post<AuthResponse>("/auth/login", data);

  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post<AuthResponse>("/auth/logout");

  return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
  const response = await api.get<AuthResponse>("/users/me");

  return response.data;
};

// Update user profile
export const updateProfile = async (data: UpdateProfileData) => {
  const response = await api.patch<AuthResponse>("/users/update-profile", data);

  return response.data;
};
