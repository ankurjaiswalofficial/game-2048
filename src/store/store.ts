import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';

const store = configureStore({
	reducer: applicationReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
