import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../types';

// Initial state
const initialState: AuthState = {
  user: null, // Initialized as null, will be hydrated on client side
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      console.log('Redux logout action dispatched. Clearing user state.');
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: { user: AuthState }) => state.user.user;

export default userSlice.reducer;
