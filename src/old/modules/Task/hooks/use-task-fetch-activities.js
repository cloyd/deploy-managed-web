import { useEffect } from 'react';

export const useTaskFetchActivities = ({
  fetchTaskActivities,
  propertyId,
  taskId,
}) =>
  useEffect(() => {
    let fetchInterval;

    if (propertyId && taskId) {
      fetchTaskActivities({ propertyId, taskId });

      // Fetch messages every minute
      fetchInterval = setInterval(
        () => fetchTaskActivities({ propertyId, taskId }),
        60000
      );
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [fetchTaskActivities, propertyId, taskId]);
