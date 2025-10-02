import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'interviewee',
  showWelcomeBackModal: false,
  searchTerm: '',
  sortBy: 'score',
  isLoading: false,
  error: null,
  notification: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowWelcomeBackModal: (state, action) => {
      state.showWelcomeBackModal = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const {
  setActiveTab,
  setShowWelcomeBackModal,
  setSearchTerm,
  setSortBy,
  setIsLoading,
  setError,
  setNotification,
  clearNotification
} = uiSlice.actions;

export default uiSlice.reducer;