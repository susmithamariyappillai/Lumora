// Common API file used to communicate with backend

// Backend API base URL
const BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage token key
const TOKEN_KEY = 'lumora_token';

// Get authentication token from localStorage
export const getToken = () =>
  localStorage.getItem(TOKEN_KEY);

// Save or remove authentication token
export const setToken = (t) =>
  (
    t
      ? localStorage.setItem(TOKEN_KEY, t)
      : localStorage.removeItem(TOKEN_KEY)
  );

// Common function to handle API requests
async function request(method, path, { params, body } = {}) {

  // Create URL query parameters
  const qs = new URLSearchParams();

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      qs.set(k, v);
    }
  });

  // Build complete API URL
  const url = `${BASE}${path}${qs.toString() ? `?${qs}` : ''}`;

  // Set request headers
  const headers = {
    'Content-Type': 'application/json'
  };

  // Get authentication token
  const token = getToken();

  // Attach token to request if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;

  try {
    // Send request to backend
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

  } catch {
    // Handle server connection errors
    const e = new Error(
      'Cannot reach the Lumora server. Make sure the backend is running (npm run dev in the backend folder).'
    );

    e.unavailable = true;
    throw e;
  }

  // Convert backend response into JSON
  let data = {};

  try {
    data = await res.json();
  } catch {
    // Handle empty response body
  }

  // Handle API errors
  if (!res.ok) {
    const e = new Error(
      data.message || `Request failed (${res.status})`
    );

    e.status = res.status;
    e.unavailable = res.status === 503;

    throw e;
  }

  // Return successful response data
  return data;
}

// Different API request methods
export const api = {

  // Get data from backend
  get: (path, params) =>
    request('GET', path, { params }),

  // Send new data to backend
  post: (path, body) =>
    request('POST', path, { body }),

  // Update existing data
  patch: (path, body) =>
    request('PATCH', path, { body }),

  // Delete data from backend
  del: (path, params) =>
    request('DELETE', path, { params }),
};