import client from "./client";

export const login = async (credentials) => {
  return client.post("/auth/login", credentials);
};

export const register = async (userData) => {
  return client.post("/auth/register", userData);
};

export const getMe = async () => {
  return client.get("/auth/me");
};
