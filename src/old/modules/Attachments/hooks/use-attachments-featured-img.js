import { useMemo } from 'react';

// Attachment sizes - large, medium, original, thumb
export const useAttachmentsFeaturedImg = (attachments = [], size = 'medium') =>
  useMemo(() => {
    const featuredAttachment =
      attachments && attachments.length > 0
        ? attachments.find((file) => file.urls && !!file.urls[size])
        : null;

    return featuredAttachment ? featuredAttachment.urls[size] : '';
  }, [attachments, size]);
