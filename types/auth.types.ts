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

export interface SignupRequest {
  fullName: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

export type OtpPurpose = 'signup_verify' | 'password_reset';

export interface OtpRequestBody {
  phone: string;
  purpose: OtpPurpose;
}

export interface OtpVerifyBody {
  phone: string;
  otp: string;
  purpose: OtpPurpose;
  /** Only required (and validated) when `purpose` is 'password_reset'. */
  password?: string;
  passwordConfirmation?: string;
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
