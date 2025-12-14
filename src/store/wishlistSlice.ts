import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TmdbMovie } from '../api/tmdb';

type WishlistState = {
  items: TmdbMovie[];
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<TmdbMovie[]>) {
      state.items = action.payload;
    },
    toggleWishlist(state, action: PayloadAction<TmdbMovie>) {
      const exists = state.items.some((m) => m.id === action.payload.id);
      state.items = exists
        ? state.items.filter((m) => m.id !== action.payload.id)
        : [...state.items, action.payload];
    },
  },
});

export const { setWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
