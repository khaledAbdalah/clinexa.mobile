export interface User {
  id: string;
  fullName: string;
  /** Null for a social (Google/Apple) signup until the user adds one. */
  phone: string | null;
  email: string;
  initials: string;
  isPhoneVerified: boolean;
  isOnboardingComplete: boolean;
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
  email: string;
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
    /** True when this login reactivated a temporarily-deleted account. */
    restored?: boolean;
  };
}

export interface AddPhoneRequest {
  phone: string;
}

export interface AppleLoginRequest {
  identityToken: string;
  /** Apple only supplies the name on the very first authorization. */
  fullName?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type DeleteAccountType = 'temporary' | 'permanent';

export interface DeleteAccountRequest {
  password: string;
  type: DeleteAccountType;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
