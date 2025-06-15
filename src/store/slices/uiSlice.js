import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: localStorage.getItem("activeTab") || "dashboard",
  theme: "light",
  notifications: [],
  loading: false,
  error: null,
  currentView: localStorage.getItem("currentView") || "landing",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Set active tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      localStorage.setItem("activeTab", action.payload);
    },

    // Set current view
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
      localStorage.setItem("currentView", action.payload);
    },

    // Set theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    // Add notification
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    // Remove notification
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setActiveTab,
  setCurrentView,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectCurrentView = (state) => state.ui.currentView;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUiLoading = (state) => state.ui.loading;
export const selectUiError = (state) => state.ui.error;
