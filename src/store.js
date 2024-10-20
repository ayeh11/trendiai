import { configureStore, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  tiktoks: [],
  selectedTikTok: null,
  error: null
};

// Slice: Handles state, actions, and reducers
const tiktokSlice = createSlice({
  name: 'tiktoks',
  initialState,
  reducers: {
    setTikToks: (state, action) => {
      state.tiktoks = action.payload;
    },
    setSelectedTikTok: (state, action) => {
      state.selectedTikTok = action.payload;
    },
    toggleFavoriteInState: (state, action) => {
      const tiktok = state.tiktoks.find(t => t.name === action.payload);
      if (tiktok) {
        tiktok.favorite = !tiktok.favorite;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Export actions from the slice
export const { setTikToks, setSelectedTikTok, toggleFavoriteInState, setError } = tiktokSlice.actions;

// Async actions 
export const fetchTikToks = () => async (dispatch) => {
  try {
    const response = await axios.get('https://trendiai-backend.onrender.com/api/v1/tiktoks');
    const tiktoks = response.data.data;
    dispatch(setTikToks(tiktoks));
  } catch (error) {
    dispatch(setError('Failed to fetch TikToks'));
    console.error('Failed to fetch TikToks:', error);
  }
};

export const toggleFavorite = (tiktokName) => (dispatch) => {
  dispatch(toggleFavoriteInState(tiktokName));
};

export const selectTikTok = (tiktok) => (dispatch) => {
  dispatch(setSelectedTikTok(tiktok));
};

// Create the Redux store using configureStore
const store = configureStore({
  reducer: tiktokSlice.reducer,
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;
