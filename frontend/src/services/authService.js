import { api, setToken } from './api';

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password });
  setToken(data.token);
  return data.user;
}
export async function register(form) {
  const data = await api.post('/auth/register', form);
  setToken(data.token);
  return data.user;
}
export const fetchMe = async () => (await api.get('/auth/me')).user;
export const updateName = async (name) => (await api.patch('/auth/me', { name })).user;
export const logoutRequest = () => api.post('/auth/logout').catch(() => {});
