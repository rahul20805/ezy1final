export interface UserProfile {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  role: string;
  walletBal?: number;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserProfile;
  message?: string;
  cooldownSeconds?: number;
  expiresInSeconds?: number;
  debugOtp?: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  eventId?: string;
  type: string;
  category: string;
  title: string;
  message: string;
  priority: "CRITICAL" | "HIGH" | "NORMAL" | "LOW" | "MARKETING";
  data?: string;
  actionUrl?: string;
  isRead: number | boolean;
  readAt?: string;
  channel?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  orders: boolean | number;
  delivery: boolean | number;
  bookings: boolean | number;
  bus: boolean | number;
  doctor: boolean | number;
  hospital: boolean | number;
  services: boolean | number;
  offers: boolean | number;
  announcements: boolean | number;
  pushEnabled?: boolean | number;
  smsEnabled?: boolean | number;
  emailEnabled?: boolean | number;
}

const AUTH_TOKEN_KEY = "ezy1_auth_token";
const AUTH_USER_KEY = "ezy1_customer_user";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getStoredUser(): UserProfile | null {
  const data = localStorage.getItem(AUTH_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

// Universal API Fetcher
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure leading slash
  const url = endpoint.startsWith("http")
    ? endpoint
    : endpoint.startsWith("/api")
    ? endpoint
    : `/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// 1. Customer Authentication API Helpers
export async function requestOtp(phone: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtpCode(phone: string, otp: string, name?: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone, otp, name }),
  });
  if (data.token && data.user) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

export async function loginWithPassword(username: string, password: string): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (data.token && data.user) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

export async function registerAccount(payload: {
  name: string;
  username: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
  email?: string;
}): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.token && data.user) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

export async function checkUsernameAvailability(username: string): Promise<{ available: boolean; message?: string }> {
  return apiRequest<{ available: boolean; message?: string }>(
    `/api/auth/check-username?username=${encodeURIComponent(username)}`
  );
}


export async function loginWithGoogle(payload: {
  email?: string;
  name?: string;
  googleId?: string;
  avatar?: string;
  phone?: string;
  credential?: string;
}): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.token && data.user) {
    setAuthToken(data.token);
    setStoredUser(data.user);
  }
  return data;
}

export async function fetchCurrentUser(): Promise<{ user: UserProfile }> {
  return apiRequest<{ user: UserProfile }>("/api/auth/me");
}

export async function logoutCustomer(): Promise<{ success: boolean }> {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (err) {
    // Ignore error
  }
  clearAuthSession();
  return { success: true };
}

// 2. Notification API Helpers
export async function fetchNotifications(params?: {
  category?: string;
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.unreadOnly) query.set("unreadOnly", "true");
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));

  const qs = query.toString();
  return apiRequest<{ notifications: NotificationItem[]; unreadCount: number }>(
    `/api/notifications${qs ? `?${qs}` : ""}`
  );
}

export async function markNotificationAsRead(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>("/api/notifications/read-all", {
    method: "POST",
  });
}

export async function deleteNotificationById(id: number): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>(`/api/notifications/${id}`, {
    method: "DELETE",
  });
}

export async function fetchNotificationPreferences(): Promise<{ preferences: NotificationPreferences }> {
  return apiRequest<{ preferences: NotificationPreferences }>("/api/notifications/preferences");
}

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<{ success: boolean; preferences: NotificationPreferences }> {
  return apiRequest<{ success: boolean; preferences: NotificationPreferences }>(
    "/api/notifications/preferences",
    {
      method: "PUT",
      body: JSON.stringify(preferences),
    }
  );
}

export async function triggerTestNotification(payload: {
  type?: string;
  data?: Record<string, any>;
  customTitle?: string;
  customMessage?: string;
  priority?: string;
  actionUrl?: string;
}): Promise<{ success: boolean; notification: NotificationItem }> {
  return apiRequest<{ success: boolean; notification: NotificationItem }>(
    "/api/notifications/test-event",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
