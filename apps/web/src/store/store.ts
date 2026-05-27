import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from './slices/assignmentSlice';

export const store = configureStore({
  reducer: {
    assignment: assignmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['assignment.form.sourceFile'],
        ignoredActionPaths: ['payload.value', 'meta.arg.sourceFile'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
