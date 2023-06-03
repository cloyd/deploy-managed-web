import { useMemo } from 'react';

const hasNote = (user) => !!user.note;
const hasAttachment = (user) => user.attachments && user.attachments.length > 0;

export const useInspectionShowComment = (manager = {}, tenant = {}) =>
  useMemo(
    () => ({
      showManager: hasNote(manager) || hasAttachment(manager),
      showTenant: hasNote(tenant) || hasAttachment(tenant),
    }),
    [manager, tenant]
  );
