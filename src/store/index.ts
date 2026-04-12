import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import boardDraftReducer from './features/boardDraftSlice';
import { apiSlice } from './features/apiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    boardDraft: boardDraftReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
