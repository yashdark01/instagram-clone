import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

const selectUIState = (state: RootState) => state.ui;

export const selectSearchModalOpen = createSelector([selectUIState], (ui) => ui.searchModalOpen);
export const selectSearchQuery = createSelector([selectUIState], (ui) => ui.searchQuery);
export const selectSearchResults = createSelector([selectUIState], (ui) => ui.searchResults);
export const selectNotifications = createSelector([selectUIState], (ui) => ui.notifications);
export const selectActiveModal = createSelector([selectUIState], (ui) => ui.activeModal);

