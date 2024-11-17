import { create } from 'zustand';
import { User } from '../lib/types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  setAuth: (token) => {
    localStorage.setItem('token', token);
    const user = jwtDecode<User>(token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));