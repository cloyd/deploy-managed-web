import { createSelector } from 'reselect';

const selectSettings = (state) => state.settings;

export const selectTwoFactorFeatureEnabled = createSelector(
  [selectSettings],
  (setting) => setting.authyEnabled
);

export const selectMaxAttachmentFileSize = createSelector(
  [selectSettings],
  (settings) => settings.maxAttachmentSizeInBytes
);
