import { createSlice, createAsyncThunk, configureStore, combineReducers } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const fetchTikToks = createAsyncThunk('tiktoks/fetchTikToks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://trendiai-backend.onrender.com/api/v1/tiktoks');
    const tiktoks = Array.isArray(response.data.data) ? response.data.data : [];
    return tiktoks;
  } catch (error) {
    return rejectWithValue('Failed to fetch TikToks');
  }
});

const tiktoksSlice = createSlice({
  name: 'tiktoks',
  initialState: [],
  reducers: {
    selectTikTok: (state, action) => action.payload,
    toggleFavorite: (state, action) => {
      const tiktok = state.find(t => t.name === action.payload);
      if (tiktok) {
        tiktok.favorite = !tiktok.favorite;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTikToks.fulfilled, (state, action) => action.payload)
      .addCase(fetchTikToks.rejected, (state, action) => {
      });
  }
});
export const { selectTikTok, toggleFavorite } = tiktoksSlice.actions;

const selectedTikTokSlice = createSlice({
    name: 'selectedTikTok',
    initialState: null,
    reducers: {
      setSelectedTikTok: (state, action) => action.payload,
    },
  });
  export const { setSelectedTikTok } = selectedTikTokSlice.actions;

const errorSlice = createSlice({
  name: 'error',
  initialState: null,
  reducers: {
    setError: (state, action) => action.payload,
  },
});
export const { setError } = errorSlice.actions;

const rootReducer = combineReducers({
  tiktoks: tiktoksSlice.reducer,
  selectedTikTok: selectedTikTokSlice.reducer,
  error: errorSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tiktoks'], // Only persist the 'tiktoks' slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;

