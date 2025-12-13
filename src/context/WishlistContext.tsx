import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { TmdbMovie } from '../api/tmdb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setWishlist, toggleWishlist as toggleWishlistAction } from '../store/wishlistSlice';

type WishlistContextType = {
  items: TmdbMovie[];
  isWishlisted: (id: number) => boolean;
  toggle: (movie: TmdbMovie) => void;
};

const STORAGE_NAMESPACE = process.env.REACT_APP_STORAGE_NAMESPACE || 'netflix-lite';
const STORAGE_KEY_WISHLIST = `${STORAGE_NAMESPACE}:wishlist`;

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.wishlist.items);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dispatch(setWishlist(parsed));
        }
      } catch {
        dispatch(setWishlist([]));
      }
    }
  }, [dispatch]);

  const persist = (next: TmdbMovie[]) => {
    dispatch(setWishlist(next));
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(next));
  };

  const isWishlisted = (id: number) => items.some((m) => m.id === id);

  const toggle = (movie: TmdbMovie) => {
    if (isWishlisted(movie.id)) {
      const next = items.filter((m) => m.id !== movie.id);
      dispatch(toggleWishlistAction(movie));
      persist(next);
    } else {
      const next = [...items, movie];
      dispatch(toggleWishlistAction(movie));
      persist(next);
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
