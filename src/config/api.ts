import { create } from 'axios';
import { SecureStorage } from '@/config/secure-storage';
import { endpoints } from '@/constants/endpoints';

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}

// Set by store/auth.ts to avoid a require cycle (config/api.ts <-> store/auth.ts):
// this module can't import useAuthStore directly since auth.ts imports `api` from here.
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-platform': 'MOBILE',
  },
});

// 1. Queue control variables
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Request interceptor to add the auth token header
api.interceptors.request.use(async (config) => {
  const token = await SecureStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// 2. Setting up the interceptors
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // 3. Check if error is 401 and request hasn't been retried yet, and it's not a refresh request
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(endpoints.auth.refresh)
    ) {
      // 4. If there's a refresh request currently running, wait in the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // 5. Starting the refresh process
      return new Promise((resolve, reject) => {
        SecureStorage.getRefreshToken()
          .then((refreshToken) => api.post(endpoints.auth.refresh, { refresh: refreshToken }))
          .then(async ({ data }) => {
            await SecureStorage.setAccessToken(data.access);
            await SecureStorage.setRefreshToken(data.refresh);
            processQueue(null); // 6. Release pending requests
            resolve(api(originalRequest)); // 7. Retry the original request
          })
          .catch((refreshError) => {
            processQueue(refreshError); // 8. All failed, reject the queue
            // Clear user from store before redirecting to login
            onUnauthorized?.();
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(err);
  }
);

export { api };
