export const ATTACHMENT_CATEGORIES = Object.freeze({
  agencyAgreement: 'property_agency_agreement',
  agencyBill: 'agency_bill',
  avatar: 'profile_avatar',
  conditionReport: 'lease_condition_report',
  insuranceLicenseDocument: 'insurance_and_license_document',
  leaseAgreement: 'lease_agreement',
  propertyImage: 'property_image',
  propertyInspectionDocument: 'property_inspection_document',
  propertyInspectionManager: 'property_inspection_manager',
  propertyInspectionReport: 'property_inspection_report',
  propertyInspectionTenant: 'property_inspection_tenant',
  strataByLaws: 'property_strata_by_laws',
  taskAttachment: 'property_task_attachment',
  commercialOutgoingsEstimate: 'lease_commercial_outgoings_estimate',
});

// should we include wild cards
export const ATTACHMENT_EXTENSIONS_PER_TYPE = Object.freeze({
  image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  videos: ['.mp4', '.mov'],
  doc: ['.txt', '.pdf', '.doc', '.docx'],
  data: ['.csv', '.xls', '.xlsx'],
});

export const ATTACHMENT_EXTENSIONS = [
  ...ATTACHMENT_EXTENSIONS_PER_TYPE.image,
  ...ATTACHMENT_EXTENSIONS_PER_TYPE.videos,
  ...ATTACHMENT_EXTENSIONS_PER_TYPE.doc,
  ...ATTACHMENT_EXTENSIONS_PER_TYPE.data,
];

export const featureImage = (attachments = []) => {
  return attachments.filter(isImageType)[0];
};

export const featurePropertyImage = (attachments = []) => {
  return attachments.filter(isPropertyImage)[0];
};

export const imageSrc = (size) => (attachment) => {
  return attachment && attachment['urls'] ? attachment['urls'][size] : '';
};

export const imageSrcLarge = imageSrc('large');
export const imageSrcMedium = imageSrc('medium');
export const imageSrcOriginal = imageSrc('original');
export const imageSrcThumb = imageSrc('thumb');

export const isImageType = ({ contentType }) => {
  return /image/.test(contentType);
};

export const isAgencyAgreement = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.agencyAgreement;
};

export const isConditionReport = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.conditionReport;
};

export const isOutgoingsAttachment = ({ attachableCategory }) => {
  return (
    attachableCategory === ATTACHMENT_CATEGORIES.commercialOutgoingsEstimate
  );
};

export const isLeaseAgreement = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.leaseAgreement;
};

export const isPropertyImage = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.propertyImage;
};

export const isStrataByLaws = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.strataByLaws;
};

export const isTaskAttachment = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.taskAttachment;
};

export const isInsuranceLicenseDocument = ({ attachableCategory }) => {
  return attachableCategory === ATTACHMENT_CATEGORIES.insuranceLicenseDocument;
};

// Inspection module attachments
export const inspectionAttachmentCategoryByRole = (role) =>
  role === 'manager'
    ? ATTACHMENT_CATEGORIES.propertyInspectionManager
    : ATTACHMENT_CATEGORIES.propertyInspectionTenant;

export const inspectionAreaAttachableTypeByRole = (role) =>
  role === 'manager' ? 'PropertyConditionArea' : 'PropertyInspectionItem';

export const inspectionItemAttachableTypeByRole = (role) =>
  role === 'manager' ? 'PropertyConditionItem' : 'PropertyInspectionItem';
