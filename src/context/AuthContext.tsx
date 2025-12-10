import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
const STORAGE_KEY_USER = `${STORAGE_NAMESPACE}:user`;
const STORAGE_KEY_LOGIN = `${STORAGE_NAMESPACE}:login`;
const STORAGE_KEY_TMDB = `${STORAGE_NAMESPACE}:tmdb-key`;
const STORAGE_KEY_REMEMBER = `${STORAGE_NAMESPACE}:remember`;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    const storedLogin = localStorage.getItem(STORAGE_KEY_LOGIN) === 'true';
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoggedIn(storedLogin);
  }, []);

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
    const newUser: AuthUser = { id, password };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEY_TMDB, password);
    localStorage.setItem(STORAGE_KEY_LOGIN, 'false');
    setUser(newUser);
    setIsLoggedIn(false);
    setMode('signin');
    setOpen(false);
    return { ok: true };
  };

  const signin = (id: string, password: string, remember = false) => {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    if (!stored) {
      return { ok: false, message: '가입된 계정이 없습니다.' };
    }
    const parsed: AuthUser = JSON.parse(stored);
    if (parsed.id === id && parsed.password === password) {
      localStorage.setItem(STORAGE_KEY_LOGIN, 'true');
      localStorage.setItem(STORAGE_KEY_TMDB, password);
      if (remember) {
        localStorage.setItem(STORAGE_KEY_REMEMBER, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY_REMEMBER);
      }
      setUser(parsed);
      setIsLoggedIn(true);
      setOpen(false);
      return { ok: true };
    }
    return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
  };

  const signout = () => {
    localStorage.setItem(STORAGE_KEY_LOGIN, 'false');
    setIsLoggedIn(false);
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
