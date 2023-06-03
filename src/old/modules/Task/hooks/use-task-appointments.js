import { useMemo } from 'react';

import { formatDateRange } from '@app/utils';

const appointmentHasValue = (a) => !!a.startsAt;
const appointmentToString = (a) => formatDateRange(a.startsAt, a.endsAt);

export function useTaskAppointments(task) {
  return useMemo(() => {
    if (!task?.appointments?.length) return [];

    return task.appointments
      .filter(appointmentHasValue)
      .map(appointmentToString);
  }, [task]);
}
