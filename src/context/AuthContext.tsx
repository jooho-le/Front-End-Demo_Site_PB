import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch } from '../store/hooks';
import { setLoggedIn, setUser as setStoreUser } from '../store/authSlice';

type AuthUser = {
  id: string;
  password: string;
};

type AuthMode = 'signin' | 'signup';

type AuthContextType = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  mode: AuthMode;
  open: boolean;
  openModal: (mode: AuthMode) => void;
  closeModal: () => void;
  signin: (id: string, password: string, remember?: boolean) => { ok: boolean; message?: string };
  signup: (
    id: string,
    password: string,
    passwordConfirm?: string,
    agree?: boolean,
  ) => { ok: boolean; message?: string };
  signout: () => void;
};

const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
const STORAGE_KEY_USERS = `${STORAGE_NAMESPACE}:users`;
const STORAGE_KEY_CURRENT = `${STORAGE_NAMESPACE}:currentUser`;
const STORAGE_KEY_LOGIN = `${STORAGE_NAMESPACE}:login`;
const STORAGE_KEY_TMDB = `${STORAGE_NAMESPACE}:tmdb-key`;
const STORAGE_KEY_REMEMBER = `${STORAGE_NAMESPACE}:remember`;
const LEGACY_KEY_USER = `${STORAGE_NAMESPACE}:user`;

function loadUsers(): AuthUser[] {
  const raw = localStorage.getItem(STORAGE_KEY_USERS);
  let users: AuthUser[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        users = parsed;
      } else if (parsed && typeof parsed === 'object' && 'id' in parsed && 'password' in parsed) {
        users = [parsed as AuthUser];
      }
    } catch {
      users = [];
    }
  }
  if (users.length === 0) {
    const legacyRaw = localStorage.getItem(LEGACY_KEY_USER);
    if (legacyRaw) {
      try {
        const legacy = JSON.parse(legacyRaw);
        if (legacy && legacy.id && legacy.password) {
          users = [legacy];
        }
      } catch {
        users = [];
      }
    }
  }
  return users;
}

function persistUsers(list: AuthUser[]) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(list));
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
    const storedLogin = localStorage.getItem(STORAGE_KEY_LOGIN) === 'true';
    const list = loadUsers();
    const found = list.find((u) => u.id === storedCurrent);
    if (found) {
      setUser(found);
      dispatch(setStoreUser(found));
    }
    const loginState = storedLogin && !!storedCurrent;
    setIsLoggedIn(loginState);
    dispatch(setLoggedIn(loginState));
  }, [dispatch]);

  const openModal = (nextMode: AuthMode) => {
    setMode(nextMode);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const signup = (id: string, password: string, passwordConfirm?: string, agree?: boolean) => {
    if (!id || !password) {
      return { ok: false, message: '이메일과 비밀번호를 입력하세요.' };
    }
    if (!/\S+@\S+\.\S+/.test(id)) {
      return { ok: false, message: '이메일 형식이 올바르지 않습니다.' };
    }
    if (password !== passwordConfirm) {
      return { ok: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    if (!agree) {
      return { ok: false, message: '약관에 동의해야 합니다.' };
    }
    const list = loadUsers();
    if (list.some((u) => u.id === id)) {
      return { ok: false, message: '이미 가입된 이메일입니다.' };
    }
    const newUser: AuthUser = { id, password };
    const next = [...list, newUser];
    persistUsers(next);
    localStorage.setItem(STORAGE_KEY_TMDB, password);
    localStorage.setItem(STORAGE_KEY_CURRENT, newUser.id);
    localStorage.setItem(STORAGE_KEY_LOGIN, 'false');
    setUser(newUser);
    dispatch(setStoreUser(newUser));
    setIsLoggedIn(false);
    dispatch(setLoggedIn(false));
    setMode('signin');
    setOpen(false);
    return { ok: true };
  };

  const signin = (id: string, password: string, remember = false) => {
    const users = loadUsers();
    const found = users.find((u) => u.id === id && u.password === password);
    if (!found) {
      return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }
    localStorage.setItem(STORAGE_KEY_LOGIN, 'true');
    localStorage.setItem(STORAGE_KEY_TMDB, password);
    localStorage.setItem(STORAGE_KEY_CURRENT, found.id);
    if (remember) {
      localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER);
    }
    setUser(found);
    dispatch(setStoreUser(found));
    setIsLoggedIn(true);
    dispatch(setLoggedIn(true));
    setOpen(false);
    return { ok: true };
  };

  const signout = () => {
    localStorage.setItem(STORAGE_KEY_LOGIN, 'false');
    localStorage.removeItem(STORAGE_KEY_CURRENT);
    setIsLoggedIn(false);
    dispatch(setLoggedIn(false));
    dispatch(setStoreUser(null));
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn,
      mode,
      open,
      openModal,
      closeModal,
      signin,
      signup,
      signout,
    }),
    [user, isLoggedIn, mode, open],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
