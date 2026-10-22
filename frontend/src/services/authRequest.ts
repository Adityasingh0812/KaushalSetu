import { API_BASE_URL } from "./api";
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from "../auth/tokenStorage";

/**
 * Perform a fetch request with automatic token refresh on 401.
 * @param endpoint API endpoint (e.g., "/auth/me")
 * @param options Fetch options (method, headers, body, etc.)
 * @returns Parsed JSON response
 */
export const authenticatedFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Helper to perform the actual fetch
  const performFetch = async (attemptRefresh = false): Promise<Response> => {
    const accessToken = getAccessToken();
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await performFetch(false);

  // If we get a 401 and have a refresh token, try to refresh once
  if (response.status === 401 && getRefreshToken() !== null) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: getRefreshToken() }),
      });

      if (refreshResponse.ok) {
        const newTokens = (await refreshResponse.json()) as {
          access_token: string;
          refresh_token: string;
          token_type: string;
        };
        setTokens(newTokens.access_token, newTokens.refresh_token);
        // Retry original request with new token
        response = await performFetch(true);
      } else if (refreshResponse.status === 401 || refreshResponse.status === 403) {
        // Refresh token invalid/expired - clear auth state
        clearTokens();
        throw new Error("Refresh token invalid or expired");
      } else {
        // Other refresh errors (5xx, network) - don't clear tokens, let caller handle
        throw new Error(`Token refresh failed: ${refreshResponse.status}`);
      }
    } catch (err) {
      // Network error during refresh - don't clear tokens, let caller handle
      if (err instanceof TypeError) {
        throw new Error("Network error during token refresh");
      }
      // Other errors (already handled above for 401/403)
      throw err;
    }
  }

  if (!response.ok) {
    // Let the caller handle non-200 responses (they can check status)
    // We'll throw an error with status for consistency with previous api methods
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Convenience methods for common auth endpoints
 */
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
      token_type: string;
    };
    setTokens(data.access_token, data.refresh_token);
    return data;
  },

  register: async (email: string, fullName: string, phone: string | null, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, full_name: fullName, phone, password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Registration failed: ${response.status}`);
    }
    const data = (await response.json()) as UserResponse;
    // Registration does not return tokens; user must log in separately
    return data;
  },

  refresh: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }
    const data = (await response.json()) as {
      access_token: string;
      refresh_token: string;
      token_type: string;
    };
    setTokens(data.access_token, data.refresh_token);
    return data;
  },

  me: async () => {
    return authenticatedFetch<UserResponse>("/auth/me");
  },

  logout: async () => {
    // Optionally call backend logout endpoint if exists; for now just clear tokens
    clearTokens();
  },
};

// Define response types
interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}