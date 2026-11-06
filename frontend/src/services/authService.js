// Import API functions and token management function
import { api, setToken } from './api';

// Login an existing user
export async function login(email, password) {
  // Send email and password to backend
  const data = await api.post('/auth/login', { email, password });

  // Save the authentication token
  setToken(data.token);

  // Return the logged-in user details
  return data.user;
}

// Register a new user
export async function register(form) {
  // Send registration details to backend
  const data = await api.post('/auth/register', form);

  // Save the authentication token
  setToken(data.token);

  // Return the registered user details
  return data.user;
}

// Get the currently logged-in user's details
export const fetchMe = async () =>
  (await api.get('/auth/me')).user;

// Update the logged-in user's name
export const updateName = async (name) =>
  (await api.patch('/auth/me', { name })).user;

// Send logout request to backend
// Ignore the error if the request fails
export const logoutRequest = () =>
  api.post('/auth/logout').catch(() => {});