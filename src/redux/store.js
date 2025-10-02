import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import candidateReducer from './slices/candidateSlice';
import interviewReducer from './slices/interviewSlice';
import uiReducer from './slices/uiSlice';
import syncMiddleware from './middleware/syncMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidate'] // Only persist candidates
};

const rootReducer = combineReducers({
  candidate: candidateReducer,
  interview: interviewReducer,
  ui: uiReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(syncMiddleware)
});

export const persistor = persistStore(store);