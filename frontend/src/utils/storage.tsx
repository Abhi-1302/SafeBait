const ACCESS_TOKEN_KEY = "token";
const USER_EMAIL_KEY = "user";

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getUserEmail: () => localStorage.getItem(USER_EMAIL_KEY),
  setUserEmail: (email: string) => localStorage.setItem(USER_EMAIL_KEY, email),
  removeUserEmail: () => localStorage.removeItem(USER_EMAIL_KEY),

  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
  },
};
