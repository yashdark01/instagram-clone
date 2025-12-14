import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

interface UIState {
  searchModalOpen: boolean;
  searchQuery: string;
  searchResults: User[];
  notifications: Notification[];
  activeModal: string | null;
}

const initialState: UIState = {
  searchModalOpen: false,
  searchQuery: '',
  searchResults: [],
  notifications: [],
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSearchModal: (state) => {
      state.searchModalOpen = true;
    },
    closeSearchModal: (state) => {
      state.searchModalOpen = false;
      state.searchQuery = '';
      state.searchResults = [];
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<User[]>) => {
      state.searchResults = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
  },
});

export const {
  openSearchModal,
  closeSearchModal,
  setSearchQuery,
  setSearchResults,
  addNotification,
  removeNotification,
  setActiveModal,
} = uiSlice.actions;
export default uiSlice.reducer;

