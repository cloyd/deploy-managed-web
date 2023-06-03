import { createSlice } from '@reduxjs/toolkit';

import { initializeArray } from '../../utils';
import { isLoading } from '../helpers/reducer';

export const initialState = {
  arrears: {
    percent: {
      // Placeholder categories and data for the previous 8 days
      categories: initializeArray(8, ''),
      data: initializeArray(8, 0),
    },
    days: {
      // Placeholder data for ['1 day', '< 3 days', '< 7 days', '< 14 days', '< 30 days', '< 60 days', '> 60 days']
      data: initializeArray(7, 0),
    },
  },
  portfolioMetrics: {
    active: {
      percentage: 0,
    },
    expired: {
      percentage: 0,
    },
    pending: {
      percentage: 0,
    },
    draft: {
      percentage: 0,
    },
    total: 0,
  },
  leases: {
    leases: {
      active: {
        count: 0,
      },
      expired: {
        count: 0,
      },
      total: 0,
    },
    expiredLeases: {
      // Placeholder data for ['0-30 days', '31-60 days', '61-90 days', '91+ days']
      data: initializeArray(4, 0),
    },
    upcomingLeases: {
      // Placeholder data for ['0-30 days', '31-60 days', '61-90 days', '91+ days']
      data: initializeArray(4, 0),
    },
    rentReviews: {
      upcoming: {
        count: 0,
      },
      overdue: {
        count: 0,
      },
      noDate: {
        count: 0,
      },
      total: 0,
    },
  },
};

const fetchDashboardDataSuccess = (state, { payload }) => ({
  dashboardData: {
    arrears: {
      percent: {
        days: payload.data.managerStats.arrearsPercentageByDays.map(function (
          value
        ) {
          return (
            Object.keys(value)[0].charAt(0).toUpperCase() +
            Object.keys(value)[0].slice(1)
          );
        }),
        percentage: payload.data.managerStats.arrearsPercentageByDays.map(
          function (value) {
            return Object.values(value)[0];
          }
        ),
      },
      days: payload.data.managerStats.leasesInArrearsByDayRange.map(function (
        value
      ) {
        return Object.values(value)[0];
      }),
    },
    portfolioMetrics: payload.data.managerStats.propertyStats,
    leaseStatuses: payload.data.managerStats.leasesStats,
    leases: {
      upcoming: payload.data.managerStats.upcomingLeasesRenewalsByDayRange.map(
        function (value) {
          return Object.values(value)[0];
        }
      ),
      expired: payload.data.managerStats.expiredLeasesByDayRange.map(function (
        value
      ) {
        return Object.values(value)[0];
      }),
    },
    rentReviews: payload.data.managerStats.rentReviewStats,
  },
  isLoading: false,
});

export default createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardDataSuccess,
    error: isLoading(false),
    fetchDashboardData: isLoading(true),
  },
});
