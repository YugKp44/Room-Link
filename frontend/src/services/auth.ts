import api from './apiService'

const TOKEN_KEY = 'jwt_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t)
export const logout = () => localStorage.removeItem(TOKEN_KEY)

export async function login(email: string, password: string) {
  const { data } = await api.post('/api/auth/login', { email, password })
  setToken(data.token)
}

export async function register(email: string, password: string, role?: 'REPORTER' | 'SEEKER') {
  const { data } = await api.post('/api/auth/register', { email, password, role })
  setToken(data.token)
}
