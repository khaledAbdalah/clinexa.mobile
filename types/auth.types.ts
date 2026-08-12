export interface User {
  id: string;
  fullName: string;
  phone: string;
  initials: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    access: string;
    refresh: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
