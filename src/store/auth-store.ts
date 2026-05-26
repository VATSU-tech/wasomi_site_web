import { User } from '@/types/domain';

const KEY = 'wasomi.auth.token';
let tokenState: string | null = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null;
let userState: User | null = null;

export const authStore = {
  getToken: () => tokenState,
  getUser: () => userState,
  setSession: (token: string, user: User) => { tokenState = token; userState = user; localStorage.setItem(KEY, token); },
  clear: () => { tokenState = null; userState = null; localStorage.removeItem(KEY); },
  setUser: (user: User | null) => { userState = user; },
};
