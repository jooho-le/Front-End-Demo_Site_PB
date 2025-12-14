import { configureStore } from '@reduxjs/toolkit';
import authReducer from './store/authSlice';
import wishlistReducer from './store/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
