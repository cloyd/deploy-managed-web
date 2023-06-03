export const COLORS = {
  RED: '#E33636',
  BLUE: '#008FFB',
  YELLOW: '#FEB019',
  GREEN: '#07B561',
  ORANGE: '#F7751E',
};

export const { RED, BLUE, YELLOW, GREEN, ORANGE } = COLORS;

export const ARREARS = {
  DAYS_LABELS: ['1', '2 - 3', '4 - 7', '8 - 14', '15 - 30', '31 - 60', '> 60'],
  SELECT_STYLE: {
    container: (base) => ({
      ...base,
      width: 160,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 12,
    }),
  },
  SELECT_OPTIONS: [
    { label: 'Arrears %', value: 'percent' },
    { label: 'Days in Arrears', value: 'days' },
  ],
  DEFAULT_OPTION: { label: 'Days in Arrears', value: 'days' },
};

export const LEASES = {
  DAYS_LABELS: ['0-30 days', '31-60 days', '61-90 days', '91+ days'],
  URL_MAP: {
    leases: 'by_lease',
    expiredLeases: 'by_expired_lease',
    upcomingLeases: 'by_upcoming_lease',
    rentReviews: 'by_rent_reviews',
  },
};
