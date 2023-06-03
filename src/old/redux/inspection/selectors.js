import { getPrevAndNextArea } from './helpers';

export const getInspectionProperty = (state, propertyId = null) => {
  const { properties } = state;

  return properties.data && properties.data[propertyId]
    ? properties.data[propertyId]
    : {};
};

// Property Areas
export const getInspectionArea = (state, areaId = null) => {
  const { areas } = state;
  return areas.data && areas.data[areaId] ? areas.data[areaId] : {};
};

export const getInspectionAreasById = (state, areaIds = []) => {
  const { areas } = state;

  return areaIds.length > 0 && areas.data
    ? [...areaIds].map((id) => areas.data[id])
    : [];
};

// Property Area Items
export const getInspectionAreaItems = (state, areaId = null) => {
  const area = getInspectionArea(state, areaId);
  const { items } = area;

  return items && state.items.data
    ? items.map((id) => state.items.data[id])
    : [];
};

// Inspection Conditions
export const getInspectionCondition = (state, propertyConditionId = null) => {
  const { conditions } = state;

  return conditions.data && conditions.data[propertyConditionId]
    ? conditions.data[propertyConditionId]
    : {};
};

export const getInspectionConditionByProperty = (state, propertyId = null) => {
  const property = getInspectionProperty(state, propertyId);
  return getInspectionCondition(state, property.propertyConditionId);
};

export const getInspectionConditionPrevAndNextArea = (
  state,
  propertyConditionId = null,
  areaId = null
) => {
  const condition = getInspectionCondition(state, propertyConditionId);
  return getPrevAndNextArea(condition?.areas, areaId);
};

// Inspection Reports
export const getInspectionReport = (state, reportId = null) => {
  const { data } = state.reports;
  return data && data[reportId] ? data[reportId] : {};
};

export const getInspectionPropertyReports = (state, propertyId = null) => {
  const property = getInspectionProperty(state, propertyId);
  const { reports } = property;

  return reports && reports.length > 0
    ? reports.map((id) => state.reports.data[id])
    : [];
};

export const getInspectionReportsByLease = (state, propertyId = null) => {
  const reports = getInspectionPropertyReports(state, propertyId);
  let sortedReports = {};

  reports.forEach((report) => {
    const { lease } = report;

    if (lease.id) {
      sortedReports[lease.id] = {
        ...lease,
        reports: sortedReports[lease.id]
          ? // Return reports by descending inspection date order
            [...sortedReports[lease.id].reports, report].sort(
              (a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate)
            )
          : [report],
      };
    }
  });

  return sortedReports;
};

export const getCreatedInspectionReport = (state) => {
  const { result } = state.reports;
  return result ? getInspectionReport(state, result) : {};
};

export const getInspectionReportPrevAndNextArea = (
  state,
  reportId = null,
  areaId = null
) => {
  const report = getInspectionReport(state, reportId);
  const { areas } = report;

  return getPrevAndNextArea(areas, areaId);
};
