import findIndex from 'lodash/fp/findIndex';

/**
 * Return previous and next areas in list
 *
 * @param {Object[]} areas
 * @param {*} areaId
 */
export const getPrevAndNextArea = (areas = [], areaId = null) => {
  if (areaId) {
    const areaIdNum = parseInt(areaId, 10);
    const index = findIndex((id) => id === areaIdNum, areas);
    const prevAreaId = index > 0 ? areas[index - 1] : null;
    const nextAreaId =
      index >= 0 && index < areas.length - 1 ? areas[index + 1] : null;

    return [prevAreaId, nextAreaId];
  } else {
    return [];
  }
};

/**
 * If the given user the report's primary tenant
 *
 * @param {*} report
 * @param {*} userId
 * @param {*} isTenant
 * @returns {boolean}
 */
export const isInspectionReportTenant = (
  report = {},
  userId = null,
  isTenant = false
) =>
  isTenant && report.tenant && userId ? report.tenant.id === userId : false;
