import flow from 'lodash/fp/flow';
import { createLogic } from 'redux-logic';

import {
  getDataWithProps,
  processDeleteWithProps,
  processError,
  processGetWithProps,
  processPatchWithProps,
  processPostWithProps,
  processSuccess,
} from '../helpers/logic';
import { fetchTask } from '../task';
import inspection from './reducer';

const actions = inspection.actions;

/**
 * Process helpers
 */
const processGet = flow(processGetWithProps, getDataWithProps);

const processPost = flow(processPostWithProps, getDataWithProps);

const processPatch = flow(processPatchWithProps, getDataWithProps);

const processDelete = flow(processDeleteWithProps, getDataWithProps);

/**
 * Actions logic
 */
export const createAreaLogic = createLogic({
  type: actions.createArea,
  processOptions: {
    successType: actions.createAreaSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { params, propertyConditionId } = action.payload;

    if (propertyConditionId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_conditions/${propertyConditionId}/areas`,
          params,
          props: {
            message: 'area has been created.',
            propertyConditionId,
            reportId: params.reportId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'property condition id is required' }));
    }
  },
  process: processPost,
});

export const createAreaItemLogic = createLogic({
  type: actions.createAreaItem,
  processOptions: {
    successType: actions.createAreaItemSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaId, params } = action.payload;

    if (areaId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_condition_areas/${areaId}/items`,
          params,
          props: {
            message: 'area item has been created.',
            areaId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'area id is required' }));
    }
  },
  process: processPost,
});

export const createReportLogic = createLogic({
  type: actions.createReport,
  processOptions: {
    successType: actions.createReportSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { isUploadedReport, propertyId, ...params } = action.payload;

    if (propertyId) {
      next({
        type: action.type,
        payload: {
          endpoint: '/property_inspection_reports',
          params,
          props: {
            message: 'report has been created.',
            isUploadedReport,
            propertyId,
            propertyTaskId: params.propertyTaskId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'property id is required' }));
    }
  },
  process: processPost,
});

export const createReportSuccessLogic = createLogic({
  type: actions.createReportSuccess,
  process: flow(({ action }, dispatch, done) => {
    const { payload } = action || {};

    if (payload?.props?.propertyId && payload.props.propertyTaskId) {
      dispatch(
        fetchTask({
          propertyId: payload.props.propertyId,
          taskId: payload.props.propertyTaskId,
        })
      );
    }

    done();
  }),
});

export const deleteAreaLogic = createLogic({
  type: actions.deleteArea,
  processOptions: {
    successType: actions.deleteAreaSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaId, params, propertyConditionId } = action.payload;

    if (areaId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_condition_areas/${areaId}`,
          params,
          props: {
            message: 'area has been deleted.',
            propertyConditionId,
            reportId: params.reportId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'area id is required' }));
    }
  },
  process: processDelete,
});

export const deleteAreaItemLogic = createLogic({
  type: actions.deleteAreaItem,
  processOptions: {
    successType: actions.deleteAreaItemSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaItemId, params } = action.payload;

    if (areaItemId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_condition_items/${areaItemId}`,
          params,
          props: {
            message: 'area item has been deleted.',
            areaItemId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'area item id is required' }));
    }
  },
  process: processDelete,
});

export const deleteReportLogic = createLogic({
  type: actions.deleteReport,
  processOptions: {
    successType: actions.deleteReportSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { propertyId, reportId } = action.payload;

    if (reportId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_inspection_reports/${reportId}`,
          props: {
            message: 'report has been deleted.',
            propertyId,
          },
        },
      });
    } else {
      reject(actions.error({ message: 'report id is required' }));
    }
  },
  process: processDelete,
});

export const errorMessageLogic = createLogic({
  type: [actions.error],
  process: flow(processError),
});

export const fetchAreaLogic = createLogic({
  type: actions.fetchArea,
  processOptions: {
    successType: actions.fetchAreaSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaId, params } = action.payload;

    if (areaId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_condition_areas/${areaId}`,
          params,
        },
      });
    } else {
      reject(actions.error({ message: 'area id is required' }));
    }
  },
  process: processGet,
});

export const fetchConditionLogic = createLogic({
  type: actions.fetchCondition,
  processOptions: {
    successType: actions.fetchConditionSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { propertyId } = action.payload;

    if (propertyId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/properties/${propertyId}/condition`,
          props: { propertyId },
        },
      });
    } else {
      reject(actions.error({ message: 'property id is required' }));
    }
  },
  process: processGet,
});

export const fetchReportLogic = createLogic({
  type: actions.fetchReport,
  processOptions: {
    successType: actions.fetchReportSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { reportId } = action.payload;

    if (reportId) {
      next({
        type: action.type,
        payload: { endpoint: `/property_inspection_reports/${reportId}` },
      });
    } else {
      reject(actions.error({ message: 'report id is required' }));
    }
  },
  process: processGet,
});

export const fetchReportsLogic = createLogic({
  type: actions.fetchReports,
  processOptions: {
    successType: actions.fetchReportsSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { propertyId } = action.payload;

    if (propertyId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_inspection_reports`,
          params: { propertyId },
          props: { propertyId },
        },
      });
    } else {
      reject(actions.error({ message: 'property id is required' }));
    }
  },
  process: processGet,
});

export const sendToTenantLogic = createLogic({
  type: actions.sendToTenant,
  processOptions: {
    successType: actions.updateReportSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { reportId } = action.payload;

    if (reportId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_inspection_reports/${reportId}/send_to_tenant`,
        },
      });
    } else {
      reject(actions.error({ message: 'report id is required' }));
    }
  },
  process: processPost,
});

export const successMessageLogic = createLogic({
  type: [
    actions.createAreaSuccess,
    actions.createAreaItemSuccess,
    actions.createReportSuccess,
    actions.deleteAreaSuccess,
    actions.deleteAreaItemSuccess,
    actions.updateReportSuccess,
  ],
  process: flow(processSuccess),
});

export const updateAreaLogic = createLogic({
  type: actions.updateArea,
  processOptions: {
    successType: actions.updateAreaSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaId, params } = action.payload;

    if (areaId) {
      let payload = {
        endpoint: `/property_condition_areas/${areaId}`,
        params,
      };

      if (params.propertyConditionId) {
        payload.props = { propertyConditionId: params.propertyConditionId };
      }

      if (params.reportId) {
        payload.props = { reportId: params.reportId };
      }

      next({ type: action.type, payload });
    } else {
      reject(actions.error({ message: 'area id is required' }));
    }
  },
  process: processPatch,
});

export const updateAreaItemLogic = createLogic({
  type: actions.updateAreaItem,
  processOptions: {
    successType: actions.updateAreaItemSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { areaItemId, params } = action.payload;

    if (areaItemId) {
      let payload = {
        endpoint: `/property_condition_items/${areaItemId}`,
        params,
      };

      if (params.areaId) {
        payload.props = { areaId: params.areaId };
      }

      next({ type: action.type, payload });
    } else {
      reject(actions.error({ message: 'area item id is required' }));
    }
  },
  process: processPatch,
});

export const updateReportLogic = createLogic({
  type: actions.updateReport,
  processOptions: {
    successType: actions.updateReportSuccess,
    failType: actions.error,
  },
  transform: ({ action }, next, reject) => {
    const { params, reportId } = action.payload;

    if (reportId) {
      next({
        type: action.type,
        payload: {
          endpoint: `/property_inspection_reports/${reportId}`,
          params,
        },
      });
    } else {
      reject(actions.error({ message: 'report id is required' }));
    }
  },
  process: processPatch,
});
