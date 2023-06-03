import { formatDate } from '../../utils';
import {
  ACTIVATE,
  ADD_TENANT,
  DISBURSE,
  ERROR,
  FETCH,
  FETCH_ACTIVATION_TASKS,
  FETCH_ACTIVATION_TASKS_SUCCESS,
  FETCH_ALL,
  FETCH_ALL_SUCCESS,
  FETCH_LEASE_LOG,
  FETCH_LEASE_LOG_SUCCESS,
  FETCH_MODIFICATIONS,
  FETCH_MODIFICATIONS_SUCCESS,
  LOG_PROPERTIES_WHITE_LIST,
  MODIFY_RENT,
  SUCCESS,
  UPDATE,
  UPDATE_ATTACHMENTS,
} from './constants';

export const initialState = {
  isLoading: false,
  result: null,
  results: [],
  expired: {},
  leases: {},
  modifications: {},
  leaseItems: [],
  logs: [],
};

export const reducer = (state = initialState, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIVATE:
    case ADD_TENANT:
    case DISBURSE:
    case FETCH:
    case FETCH_ALL:
    case FETCH_MODIFICATIONS:
    case FETCH_ACTIVATION_TASKS:
    case MODIFY_RENT:
    case UPDATE:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_ALL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        results: payload.results,
        leases: {
          ...state.leases,
          ...payload.data,
        },
      };

    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        result: payload.result,
        leases: {
          ...state.leases,
          ...payload.data,
        },
      };

    case FETCH_MODIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        modifications: {
          ...state.modifications,
          [payload.leaseId]: payload.modifications,
        },
      };

    case FETCH_ACTIVATION_TASKS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        leaseItems: {
          ...state.leaseItems,
          [payload.leaseId]: payload.leaseItems,
        },
      };

    case ERROR:
      return {
        ...state,
        isLoading: false,
      };

    case UPDATE_ATTACHMENTS:
      return {
        ...state,
        leases: {
          ...state.leases,
          [payload.attachableId]: {
            ...state.leases[payload.attachableId],
            attachments: payload.attachments,
          },
        },
      };

    case FETCH_LEASE_LOG:
      return {
        ...state,
        isLoading: true,
        logs: [],
      };

    case FETCH_LEASE_LOG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // flatted data here
        logs: payload?.logs.reduce(
          (acc, { changedValues, body, id, verb, auditableType, ...rest }) => {
            return [
              ...acc,
              ...(changedValues
                ? Object.entries(changedValues).reduce((acc, [key, values]) => {
                    // show only properties that would make sense for a principal to view and can be edited
                    if (!LOG_PROPERTIES_WHITE_LIST.includes(key)) {
                      return [...acc];
                    }

                    const propertyValue =
                      verb === 'updated'
                        ? {
                            oldValue: values[0],
                            newValue: values[1],
                          }
                        : {
                            oldValue: null,
                            newValue: values,
                          };

                    return [
                      ...acc,
                      {
                        logId: id,
                        property: key,
                        verb: auditableType === 'LeaseRent' ? 'updated' : verb,
                        info: changedValues.reason
                          ? `This is a ${
                              changedValues.reason
                            } change that will be effective from ${formatDate(
                              changedValues.effectiveDate
                            )}`
                          : '',
                        ...propertyValue,
                        ...rest,
                      },
                    ];
                  }, [])
                : []),
            ];
          },
          []
        ),
      };

    default:
      return state;
  }
};
