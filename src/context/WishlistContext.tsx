import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { TmdbMovie } from '../api/tmdb';

type WishlistContextType = {
  items: TmdbMovie[];
  isWishlisted: (id: number) => boolean;
  toggle: (movie: TmdbMovie) => void;
};

const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
const STORAGE_KEY_WISHLIST = `${STORAGE_NAMESPACE}:wishlist`;

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TmdbMovie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const persist = (next: TmdbMovie[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(next));
  };

  const isWishlisted = (id: number) => items.some((m) => m.id === id);

  const toggle = (movie: TmdbMovie) => {
    if (isWishlisted(movie.id)) {
      persist(items.filter((m) => m.id !== movie.id));
    } else {
      persist([...items, movie]);
    }
  };

  const value = useMemo(
    () => ({
      items,
      isWishlisted,
      toggle,
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
