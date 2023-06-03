import { createSlice } from '@reduxjs/toolkit';
import { original } from 'immer';
import keyBy from 'lodash/fp/keyBy';
import merge from 'lodash/fp/merge';
import uniq from 'lodash/fp/uniq';

import { formatItemPositions, isLoading } from '../helpers/reducer';
import {
  getInspectionAreaItems,
  getInspectionAreasById,
  getInspectionCondition,
  getInspectionReport,
} from './selectors';

// Store state
export const initialState = {
  isLoading: false,
  areas: { data: {}, ids: [] },
  items: { data: {}, ids: [] },
  conditions: { data: {}, ids: [] },
  properties: { data: {}, ids: [] },
  reports: { data: {}, ids: [], result: null },
};

// Helper functions
const filterArrayById = (values, filterId) =>
  values.filter((id) => id !== filterId);

const getIds = (list = []) => list.map(({ id }) => id);

const resetBlockedByReportId = (reportId, stateData = {}, stateIds = []) =>
  stateIds.reduce((updatedData, id) => {
    let data = { ...stateData[id] };

    if (data.updateBlockedByReportId === reportId) {
      data.updateBlockedByReportId = undefined;
    }

    return {
      ...updatedData,
      [id]: { ...data },
    };
  }, {});

// Reducer functions
const createAreaSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { propertyConditionId, reportId } = props;
  const areaId = data?.id;

  // Update state.conditions if property condition exists
  const conditions =
    propertyConditionId && state.conditions.data[propertyConditionId]
      ? {
          ...state.conditions,
          data: {
            ...state.conditions.data,
            [propertyConditionId]: {
              ...state.conditions.data[propertyConditionId],
              areas: state.conditions.data[propertyConditionId]
                ? [...state.conditions.data[propertyConditionId].areas, areaId]
                : [areaId],
            },
          },
        }
      : { ...state.conditions };

  // Update state.reports if report exists
  const reports =
    reportId && state.reports.data[reportId]
      ? {
          ...state.reports,
          data: {
            ...state.reports.data,
            [reportId]: {
              ...state.reports.data[reportId],
              areas: state.reports.data[reportId]
                ? [...state.reports.data[reportId].areas, areaId]
                : [data],
            },
          },
        }
      : { ...state.reports };

  return {
    ...state,
    isLoading: false,
    areas: {
      ...state.areas,
      data: {
        ...state.areas.data,
        [areaId]: { ...data },
      },
      ids: uniq([...state.areas.ids, areaId]),
    },
    conditions,
    reports,
  };
};

const createAreaItemSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { areaId } = props;

  return {
    ...state,
    isLoading: false,
    areas: {
      ...state.areas,
      data: {
        ...state.areas.data,
        [areaId]: {
          ...state.areas.data[areaId],
          items: state.areas.data[areaId]
            ? [...state.areas.data[areaId].items, data.id]
            : [data.id],
        },
      },
    },
    items: {
      ...state.items,
      data: {
        ...state.items.data,
        [data.id]: { ...data },
      },
      ids: [...state.items.ids, data.id],
    },
  };
};

const createReportSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { isUploadedReport, propertyId } = props;
  const reportId = data?.id;

  return {
    ...state,
    isLoading: false,
    reports: {
      ...state.reports,
      data: {
        ...state.reports.data,
        [reportId]: { ...data },
      },
      ids: uniq([...state.reports.ids, reportId]),
      result: isUploadedReport ? reportId : null,
    },
    properties: {
      ...state.properties,
      data: {
        ...state.properties.data,
        [propertyId]: {
          ...state.properties.data[propertyId],
          reports: state.properties.data[propertyId]
            ? [...state.properties.data[propertyId].reports, reportId]
            : [reportId],
        },
      },
    },
  };
};

const deleteAreaSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { propertyConditionId, reportId } = props;
  const areaId = data?.id;

  // Update state.conditions if property condition exists
  const conditions =
    propertyConditionId && state.conditions.data[propertyConditionId]
      ? {
          ...state.conditions,
          data: {
            ...state.conditions.data,
            [propertyConditionId]: {
              ...state.conditions.data[propertyConditionId],
              areas: state.conditions.data[propertyConditionId]
                ? filterArrayById(
                    state.conditions.data[propertyConditionId].areas,
                    areaId
                  )
                : [],
            },
          },
        }
      : { ...state.conditions };

  // Update state.reports if report exists
  const reports =
    reportId && state.reports.data[reportId]
      ? {
          ...state.reports,
          data: {
            ...state.reports.data,
            [reportId]: {
              ...state.reports.data[reportId],
              areas: state.reports.data[reportId]
                ? filterArrayById(state.reports.data[reportId].areas, areaId)
                : [],
            },
          },
        }
      : { ...state.reports };

  return {
    ...state,
    isLoading: false,
    areas: {
      ...state.areas,
      data: {
        ...state.areas.data,
        [areaId]: undefined,
      },
      ids: filterArrayById(state.areas.ids, areaId),
    },
    conditions,
    reports,
  };
};

const deleteAreaItemSuccess = (state, action) => {
  const { props } = action?.payload || {};
  const { areaItemId } = props;

  return {
    ...state,
    isLoading: false,
    items: {
      data: {
        ...state.items.data,
        [areaItemId]: undefined,
      },
      ids: filterArrayById(state.items.ids, areaItemId),
    },
  };
};

const deleteReportSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { propertyId } = props;
  const reportId = data?.id;

  // Ensure reports & conditions are no longer blocked by report
  const conditionsData = resetBlockedByReportId(
    reportId,
    state.conditions.data,
    state.conditions.ids
  );

  const reportsData = resetBlockedByReportId(
    reportId,
    state.reports.data,
    state.reports.ids
  );

  return {
    ...state,
    isLoading: false,
    conditions: {
      ...state.conditions,
      data: conditionsData,
    },
    properties: {
      ...state.properties,
      data: {
        ...state.properties.data,
        [propertyId]: {
          ...state.properties.data[propertyId],
          reports: state.properties.data[propertyId]
            ? filterArrayById(
                state.properties.data[propertyId].reports,
                reportId
              )
            : [],
        },
      },
    },
    reports: {
      ...state.reports,
      data: {
        ...reportsData,
        [reportId]: undefined,
      },
      ids: filterArrayById(state.reports.ids, reportId),
    },
  };
};

const fetchAreaSuccess = (state, action) => {
  const { data } = action?.payload || {};
  const { items = [] } = data;
  const fetchedItems = keyBy('id', items);
  const fetchedItemsKeys = getIds(items);

  return {
    ...state,
    isLoading: false,
    areas: {
      ...state.areas,
      data: {
        ...state.areas.data,
        [data.id]: {
          ...data,
          items: fetchedItemsKeys, // Areas only store the keys of their items
        },
      },
      ids: uniq([...state.areas.ids, data.id]),
    },
    items: {
      ...state.items,
      data: {
        ...state.items.data,
        ...fetchedItems,
      },
      ids: uniq([...state.items.ids, ...fetchedItemsKeys]),
    },
  };
};

const fetchConditionSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { propertyId } = props;
  const { areas = [], id: propertyConditionId } = data;
  const fetchedAreas = keyBy('id', areas);
  const fetchedAreasKeys = getIds(areas);

  return {
    ...state,
    isLoading: false,
    properties: {
      ...state.properties,
      data: {
        ...state.properties.data,
        [propertyId]: {
          ...state.properties.data[propertyId],
          propertyConditionId,
        },
      },
      ids: uniq([...state.properties.ids, propertyId]),
    },
    conditions: {
      ...state.conditions,
      data: {
        ...state.conditions.data,
        [propertyConditionId]: {
          ...data,
          areas: fetchedAreasKeys,
        },
      },
      ids: uniq([...state.conditions.ids, propertyConditionId]),
    },
    areas: {
      data: merge({ ...state.areas.data }, fetchedAreas),
      ids: uniq([...state.areas.ids, ...fetchedAreasKeys]),
    },
  };
};

const fetchReportSuccess = (state, action) => {
  const { data } = action?.payload || {};
  const { areas = [], id: reportId } = data;
  const fetchedAreas = keyBy('id', areas);
  const fetchedAreasKeys = getIds(areas);

  return {
    ...state,
    isLoading: false,
    reports: {
      ...state.reports,
      data: {
        ...state.reports.data,
        [reportId]: {
          ...data,
          areas: fetchedAreasKeys,
        },
      },
      ids: uniq([...state.reports.ids, reportId]),
    },
    areas: {
      data: merge({ ...state.areas.data }, fetchedAreas),
      ids: uniq([...state.areas.ids, ...fetchedAreasKeys]),
    },
  };
};

const fetchReportsSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const { propertyId } = props;
  const inspectionReports = data.inspectionReports || [];
  const fetchedReports = keyBy('id', inspectionReports);
  const fetchedReportsKeys = inspectionReports
    .sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate))
    .map((report) => report.id);

  return {
    ...state,
    isLoading: false,
    reports: {
      ...state.reports,
      data: {
        ...state.reports.data,
        ...fetchedReports,
      },
      ids: uniq([...state.reports.ids, ...fetchedReportsKeys]),
    },
    properties: {
      ...state.properties,
      data: {
        ...state.properties.data,
        [propertyId]: {
          ...state.properties.data[propertyId],
          reports: fetchedReportsKeys,
        },
      },
    },
  };
};

const resetCreatedReport = (state) => ({
  ...state,
  reports: {
    ...state.reports,
    result: null,
  },
});

const updateAreaSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  const formattedData = { ...data, items: getIds(data.items) };
  let areasData;

  if (props?.propertyConditionId || props?.reportId) {
    const originalState = original(state);
    const areaIds = props?.propertyConditionId
      ? getInspectionCondition(originalState, props.propertyConditionId).areas
      : props?.reportId
      ? getInspectionReport(originalState, props.reportId).areas
      : [];
    const areas = getInspectionAreasById(originalState, areaIds);

    areasData = formatItemPositions(areas, formattedData);
  } else {
    areasData = { [data.id]: { ...formattedData } };
  }

  return {
    ...state,
    isLoading: false,
    areas: {
      ...state.areas,
      data: {
        ...state.areas.data,
        ...areasData,
      },
    },
  };
};

const updateAreaItemSuccess = (state, action) => {
  const { data, props } = action?.payload || {};
  let itemsData;

  if (props?.areaId) {
    const areaItems = getInspectionAreaItems(original(state), props.areaId);
    itemsData = formatItemPositions(areaItems, data);
  } else {
    itemsData = { [data.id]: data };
  }

  return {
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      data: {
        ...state.items.data,
        ...itemsData,
      },
    },
  };
};

const updateAttachments = (state, action) => {
  const { attachments, role, storeId, storeKey } = action?.payload || {};

  return storeKey
    ? {
        ...state,
        isLoading: false,
        [storeKey]: {
          ...state[storeKey],
          data: {
            ...state[storeKey].data,
            [storeId]: {
              ...state[storeKey].data[storeId],
              [role]: {
                ...state[storeKey].data[storeId][role],
                attachments,
              },
            },
          },
        },
      }
    : state;
};

const updateReportSuccess = (state, action) => {
  const { data } = action?.payload || {};
  const { areas = [], id: reportId } = data;
  const fetchedAreas = keyBy('id', areas);
  const fetchedAreasKeys = getIds(areas);

  return {
    ...state,
    isLoading: false,
    reports: {
      ...state.reports,
      data: {
        ...state.reports.data,
        [reportId]: {
          ...data,
          areas: fetchedAreasKeys,
        },
      },
    },
    areas: {
      data: merge({ ...state.areas.data }, fetchedAreas),
      ids: uniq([...state.areas.ids, ...fetchedAreasKeys]),
    },
  };
};

const updateUploadedReport = (state, action) => {
  const { attachments, reportId } = action?.payload || {};

  return {
    ...state,
    reports: {
      ...state.reports,
      data: {
        ...state.reports.data,
        [reportId]: {
          ...state.reports.data[reportId],
          status: 'completed',
          report: {
            link: attachments[0] ? attachments[0].urls.original : null,
          },
        },
      },
    },
  };
};

// Store slice
export default createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    createArea: isLoading(true),
    createAreaSuccess,
    createAreaItem: isLoading(true),
    createAreaItemSuccess,
    createReport: isLoading(true),
    createReportSuccess,
    deleteArea: isLoading(true),
    deleteAreaSuccess,
    deleteAreaItem: isLoading(true),
    deleteAreaItemSuccess,
    deleteReport: isLoading(true),
    deleteReportSuccess,
    error: isLoading(false),
    fetchArea: isLoading(true),
    fetchAreaSuccess,
    fetchCondition: isLoading(true),
    fetchConditionSuccess,
    fetchReport: isLoading(true),
    fetchReportSuccess,
    fetchReports: isLoading(true),
    fetchReportsSuccess,
    resetCreatedReport,
    sendToTenant: isLoading(true),
    updateArea: isLoading(true),
    updateAreaSuccess,
    updateAreaItem: isLoading(true),
    updateAreaItemSuccess,
    updateAttachments,
    updateReport: isLoading(true),
    updateReportSuccess,
    updateUploadedReport,
  },
});
