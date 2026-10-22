const ACCESS_TOKEN_KEY = "kaushalsetu_access_token";
const REFRESH_TOKEN_KEY = "kaushalsetu_refresh_token";

// Initialize in-memory cache from localStorage on module load
let accessToken: string | null = (() => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
})();

let refreshToken: string | null = (() => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
})();

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  } catch {
    // Ignore localStorage errors (e.g., private browsing, quota exceeded)
  }
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const getRefreshToken = (): string | null => {
  return refreshToken;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore localStorage errors
  }
};