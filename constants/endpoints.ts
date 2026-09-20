export const endpoints = {
  auth: {
    signup: '/auth/signup',
    login: '/auth/login',
    refresh: '/auth/refresh',
    otpRequest: '/auth/otp/request',
    otpVerify: '/auth/otp/verify',
  },
  account: {
    profile: '/account/profile',
    logout: '/account/logout',
    pushTokens: '/account/push-tokens',
  },
  patient: {
    onboarding: '/patient/onboarding',
    profile: '/patient/profile',
    timeline: '/patient/timeline',
    appointments: '/patient/appointments',
  },
  notifications: {
    list: '/notifications',
    unreadCount: '/notifications/unread-count',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    delete: (id: string) => `/notifications/${id}`,
  },
  checkAuth: '/check-auth',
};
