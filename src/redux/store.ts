import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage (Web) or AsyncStorage (React Native)

import loginSlice from './slices/loginSlice';
import themeSlice from './slices/themeSlice';
import userLocationSlice from './slices/userLocationSlice';

// Combine reducers
const rootReducer = combineReducers({
    login: loginSlice,
    theme: themeSlice,
    user_location: userLocationSlice
});

// Persist configuration for the entire store
const persistConfig = {
    key: 'student', 
    storage, // Uses localStorage
};

// Apply persistReducer to the combined root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
    reducer: persistedReducer,
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
