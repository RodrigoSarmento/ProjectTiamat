import AsyncStorage from '@react-native-async-storage/async-storage';
import SavesSlice from '@redux/slices/SavesSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  type PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createEnhancers = (getDefaultEnhancers: any) => {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const reactotron = require('../../../ReactotronConfig').default;
    if (reactotron?.createEnhancer) {
      return getDefaultEnhancers().concat(reactotron.createEnhancer());
    }
  }
  return getDefaultEnhancers();
};

const rootReducer = combineReducers({
  saves: SavesSlice,
});

const rootPersistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['saves'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: createEnhancers,
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
