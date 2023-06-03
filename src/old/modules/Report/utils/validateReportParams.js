export const validateReportParams = (searchParams) => {
  const { startsAt, endsAt, resourceId, resourceType } = searchParams;

  return (
    !!startsAt &&
    startsAt.length > 0 &&
    !!endsAt &&
    endsAt.length > 0 &&
    !!resourceType &&
    resourceType.length > 0 &&
    (resourceType === 'group' || (!!resourceId && resourceId.length > 0))
  );
};

export const validateDataReportParams = (searchParams) => {
  const {
    filterType,
    propertyType,
    leaseStatus,
    agencyId,
    tenantStatus,
    ownerStatus,
  } = searchParams;

  switch (filterType) {
    case 'owner':
      return ownerStatus && agencyId;
    case 'tenant':
      return tenantStatus && agencyId;
    case 'property':
      return agencyId && propertyType;
    case 'lease':
      return agencyId && leaseStatus;
    default:
      return false;
  }
};
