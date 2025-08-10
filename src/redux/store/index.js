import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {combineReducers} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import LoginReducer from '../reducers/Login';
import NewPostReducer from '../reducers/NewPost';
import NewMediaPost from '../reducers/NewMediaPost';
import DarkthemeReducer from '../reducers/Darktheme';
import SchedulePost from '../reducers/SchedulePost';
import UserMeta from '../reducers/UserMeta';

const persistConfig = {
  key: 'observeNow',
  version: 1,
  storage: AsyncStorage,
};

const authPersistConfig = {
  key: 'Login',
  storage: AsyncStorage,
  whitelist: ['Login'],
};
console.log(authPersistConfig.storage, "authPersistConfigauthPersistConfig");

const darkthemePersistConfig = {
  key: 'Darktheme',
  storage: AsyncStorage,
  whitelist: ['Darktheme'],
};

const rootReducer = combineReducers({
  login: persistReducer(authPersistConfig, LoginReducer),
  darktheme: persistReducer(darkthemePersistConfig, DarkthemeReducer),
  newPost: NewPostReducer,
  NewMediaPost: NewMediaPost,
  SchedulePost: SchedulePost,
  UserMeta: UserMeta,
});

console.log(rootReducer);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupListeners(store.dispatch);
