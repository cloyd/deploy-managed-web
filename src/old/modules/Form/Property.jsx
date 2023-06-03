import { withFormik } from 'formik';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, CustomInput, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import {
  FormButtons,
  FormField,
  FormFieldsForAddress,
  FormFieldsForEntity,
  FormFieldsForKeys,
  FormFieldsForPropertyFeatures,
  FormFieldsForSettings,
  FormFieldsForStrata,
  FormFieldsForUser,
  FormLabel,
  defaultPropsForAddress,
  defaultPropsForEntities,
  defaultPropsForPropertyFeatures,
  defaultPropsForStrata,
  defaultPropsForUser,
  formatUserForSubmit,
  validationSchemaForEntities,
  validationSchemaForPropertyAddress,
  validationSchemaForPropertyFeatures,
  validationSchemaForUser,
  validationSchemaForUserEdit, // defaultPropsForSettings
} from '.';
import { usePrevious } from '../../hooks';
import {
  COMMERCIAL_PROPERTY_CATEGORIES,
  PROPERTY_CATEGORIES,
  PROPERTY_TYPES,
} from '../../redux/property';
import {
  ATTACHMENT_CATEGORIES,
  ATTACHMENT_EXTENSIONS_PER_TYPE,
  fromPercent,
  isPropertyImage,
  isStrataByLaws,
  toCents,
} from '../../utils';
import { CardLight } from '../Card';
import { ModalDeleteItem } from '../Modal';
import { useRolesContext } from '../Profile';
import {
  PropertyFormFieldsManagementGain,
  defaultPropsForManagementGain,
  validationSchemaForManagementGain,
} from '../Property';
import {
  PropertyFormOwnership,
  defaultPropsForPropertyOwnership,
  formatPropertyOwnershipForSubmit,
  validationSchemaForPropertyOwnership,
} from '../Property/Form';
import { UploaderFiles, UploaderForm } from '../Uploader';

const PropertyComponent = (props) => {
  const { isCorporateUser, isManager, isPrincipal } = useRolesContext();
  const prevIsLoading = usePrevious(props.isLoading);

  const {
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    isValid,
    manager,
    onCancel,
    onUploaderComplete,
    property,
    setFieldValue,
    touched,
    values,
  } = props;
  const { showOwnershipPercentage, propertyOwnerships } = values;
  const [isTypeConfirmationOpen, setIsTypeConfirmationOpen] = useState(false);
  const [propertyType, setPropertyType] = useState(
    property.propertyType || values.propertyType
  );

  const propertyAttachments = property.attachments || [];
  const attachedImages = propertyAttachments.filter(isPropertyImage);
  const attachedStrataByLaws = propertyAttachments.filter(isStrataByLaws);

  const isNewProperty = !property.id;
  const isSingleOwner = !values.secondaryOwners.filter(
    (owner) => !owner._destroy && owner.status
  ).length;

  useEffect(() => {
    const { hasError, isLoading, isSubmitting, resetForm, setSubmitting } =
      props;

    // Update isSubmitting or reset
    if (isSubmitting && prevIsLoading && !isLoading) {
      hasError ? setSubmitting(false) : resetForm();
    }
  }, [prevIsLoading, props]);

  useEffect(() => {
    if (isSingleOwner) {
      setFieldValue('showOwnershipPercentage', false);
      if (propertyOwnerships[0] !== '100%') {
        setFieldValue('propertyOwnerships', [
          { ...propertyOwnerships[0], percentageSplit: '100' },
          ...propertyOwnerships.slice(1, propertyOwnerships.length),
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSingleOwner, setFieldValue]);

  const handleOnPropertyTypeChange = useCallback(
    (e) => {
      // If creating a property - use target value else use property type state value
      const propertyTypeValue = property.id ? propertyType : e.target.value;
      setFieldValue('propertyType', propertyTypeValue);
      setFieldValue('propertyFeature[propertyType]', propertyTypeValue);
      setFieldValue(
        'propertyFeature[isResidential]',
        propertyTypeValue === 'residential'
      );
      // Reset the property category value when there is a change in property type
      setFieldValue('propertyFeature[typeOf]', '');
      setIsTypeConfirmationOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propertyType, setFieldValue]
  );

  const handlePropertyTypeChangeModal = useCallback(
    (e) => {
      setIsTypeConfirmationOpen(!isTypeConfirmationOpen);
      if (!isTypeConfirmationOpen) {
        // On click of OK - Set the property type value.
        setPropertyType(e.target.value);
      } else {
        // reset property type on click of cancel.
        setPropertyType(property.propertyType);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isTypeConfirmationOpen]
  );

  const deleteModalText = useMemo(() => {
    let deleteText = 'Property Type is required';
    if (!propertyType) return deleteText;
    if (propertyType === 'residential') {
      deleteText = `Changing the property type to ${startCase(
        propertyType
      )} may cause the Outgoings section on your lease to be removed.`;
    } else {
      deleteText = `Changing the property type to ${startCase(
        propertyType
      )} will generate a new Outgoings section to fill out in the lease section`;
    }
    return deleteText;
  }, [propertyType]);

  const ownershipTitle = (
    <div className="d-flex flex-row justify-content-between">
      Ownership Details
      {(isCorporateUser || isManager || isPrincipal) && (
        <CustomInput
          id={'show-ownership-percentage'}
          name="showOwnershipPercentage"
          type="checkbox"
          label={'Enable Split Payments'}
          onChange={handleChange}
          checked={showOwnershipPercentage || false}
          disabled={isSingleOwner}
        />
      )}
    </div>
  );

  return (
    <Form
      onSubmit={handleSubmit}
      style={{ opacity: property.isArchived ? 0.2 : 1 }}>
      {manager && (
        <Row>
          <Col xs={12} className="mb-3">
            <CardLight title="Agency" className="d-flex h-100">
              {!property.id && manager.managerAgencies && (
                <FormGroup>
                  <FormLabel for="agencyId" isRequired>
                    Agency
                  </FormLabel>
                  <FormField
                    name="agencyId"
                    type="select"
                    disabled={property.isArchived}>
                    <option value="">-- Select --</option>
                    {manager.managerAgencies.map(
                      ({ tradingName, agencyId }) => (
                        <option
                          key={`agency-${agencyId}`}
                          value={agencyId}
                          disabled={property.isArchived}>
                          {tradingName}
                        </option>
                      )
                    )}
                  </FormField>
                </FormGroup>
              )}
              <FormGroup>
                <FormLabel for="propertyType" isRequired>
                  Property Type
                </FormLabel>
                <FormField
                  name="propertyType"
                  type="select"
                  onChange={
                    property.id
                      ? handlePropertyTypeChangeModal
                      : handleOnPropertyTypeChange
                  }
                  disabled={
                    property.isArchived ||
                    !manager?.agency?.commercialModuleEnabled
                  }>
                  <option value="">-- Select --</option>
                  {PROPERTY_TYPES.map(({ name }) => (
                    <option
                      key={`type-${name}`}
                      value={name}
                      defaultValue={
                        property.propertyType || values.propertyType
                      }>
                      {startCase(name)}
                    </option>
                  ))}
                </FormField>
              </FormGroup>
              <PropertyFormFieldsManagementGain
                name="propertyManagementGain"
                values={values.propertyManagementGain}
                touched={touched.propertyManagementGain}
                errors={errors.propertyManagementGain}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isArchived={property.isArchived}
              />
            </CardLight>
          </Col>
        </Row>
      )}
      <Row className="mb-3">
        <Col xs={12} lg={6} className="mb-3 mb-lg-0">
          <CardLight title="Street Address" className="d-flex h-100">
            <FormFieldsForAddress
              isArchived={property.isArchived}
              setFieldValue={setFieldValue}
            />
          </CardLight>
        </Col>
        <Col xs={12} lg={6}>
          <CardLight title="Features" className="d-flex h-100">
            <FormFieldsForPropertyFeatures
              values={values.propertyFeature}
              touched={touched.propertyFeature}
              errors={errors.propertyFeature}
              handleChange={handleChange}
              handleBlur={handleBlur}
              isArchived={property.isArchived}
              propertyType={values.propertyType}
              categories={
                values.propertyType && values.propertyType === 'commercial'
                  ? COMMERCIAL_PROPERTY_CATEGORIES
                  : PROPERTY_CATEGORIES
              }
            />
          </CardLight>
        </Col>
      </Row>
      <CardLight title={ownershipTitle} className="mb-3">
        <h5 className="mb-3">How is this property owned</h5>
        <CustomInput
          checked={values.entityType === 'private'}
          id="private"
          label="Personally"
          name="entityType"
          type="radio"
          value="private"
          onChange={handleChange}
          disabled={property.isArchived}
        />
        <CustomInput
          checked={values.entityType === 'company'}
          className="mb-3"
          id="company"
          label="In a company or trust"
          name="entityType"
          type="radio"
          value="company"
          onChange={handleChange}
          disabled={property.isArchived}
        />
        {values.entityType === 'company' && (
          <FormFieldsForEntity
            attributeName="company"
            errors={errors.company}
            touched={touched.company}
            values={values.company}
            disabled={property.isArchived}
          />
        )}
        {isNewProperty ? (
          <>
            <hr />
            <h5 className="mb-3">Primary owner</h5>
            <FormFieldsForUser
              attributeName="primaryOwner"
              isArchived={property.isArchived}
              isDisabled={false}
              setFieldValue={setFieldValue}
              isSearchable
            />
          </>
        ) : (
          <PropertyFormOwnership
            isSoleOwnership={property.isSoleOwnership}
            isShowOwnershipPercentage={showOwnershipPercentage}
            primaryOwner={values.primaryOwner}
            secondaryOwners={values.secondaryOwners}
            propertyOwnerships={values.propertyOwnerships}
            setFieldValue={setFieldValue}
            values={values}
            touched={touched}
            isArchived={property.isArchived}
          />
        )}
      </CardLight>
      {isNewProperty ? (
        <CardLight title="Settings" className="mb-3">
          <FormFieldsForSettings {...props} />
        </CardLight>
      ) : (
        <>
          {!property.isArchived && (
            <CardLight title="Images" className="mb-3">
              {attachedImages.length > 0 && (
                <UploaderFiles
                  attachments={attachedImages}
                  attachableType="Property"
                  attachableId={property.id}
                  className="d-flex flex-wrap mb-0"
                  onDestroyComplete={onUploaderComplete}
                  isArchived={property.isArchived}
                />
              )}
              <UploaderForm
                allowedFileTypes={
                  property.isArchived
                    ? null
                    : ATTACHMENT_EXTENSIONS_PER_TYPE.image
                }
                attachableType="Property"
                attachableId={property.id}
                attachableCategory={ATTACHMENT_CATEGORIES.propertyImage}
                note="Images up to 1500 x 1000px"
                onComplete={onUploaderComplete}
              />
            </CardLight>
          )}
          <Row>
            <Col xs={12} sm={6}>
              <CardLight title="Strata" className="mb-3">
                <FormFieldsForStrata
                  values={values.propertyFeature}
                  touched={touched.propertyFeature}
                  errors={errors.propertyFeature}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  isArchived={property.isArchived}
                />
                {!property.isArchived && <div className="my-2">By-laws</div>}
                {!property.isArchived && attachedStrataByLaws.length > 0 && (
                  <UploaderFiles
                    attachments={attachedStrataByLaws}
                    attachableType="Property"
                    attachableId={property.id}
                    className="d-flex flex-wrap"
                    onDestroyComplete={onUploaderComplete}
                  />
                )}
                {!property.isArchived && (
                  <UploaderForm
                    attachableType="Property"
                    attachableId={property.id}
                    attachableCategory={ATTACHMENT_CATEGORIES.strataByLaws}
                    onComplete={onUploaderComplete}
                  />
                )}
              </CardLight>
            </Col>
            <Col xs={12} sm={6} className="mb-3">
              <CardLight title="Managing Agent" className="d-flex">
                <FormGroup>
                  {property.managers && (
                    <FormField
                      name="managerId"
                      type="select"
                      disabled={property.isArchived}>
                      <option value="">-- Select --</option>
                      {property.managers.map(({ label, value }) => (
                        <option key={`manager-${value}`} value={value}>
                          {label}
                        </option>
                      ))}
                    </FormField>
                  )}
                </FormGroup>
              </CardLight>
              <CardLight title="Key tracking" className="d-flex mt-3">
                <FormFieldsForKeys
                  values={values.propertyKeys}
                  touched={touched.propertyKeys}
                  errors={errors.propertyKeys}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  isArchived={property.isArchived}
                />
              </CardLight>
            </Col>
          </Row>
        </>
      )}
      <FormButtons
        onCancel={onCancel}
        isOverlayed
        isSubmitting={isSubmitting}
        isValid={isValid}
      />
      {/* Modal for delete confirmation */}
      <ModalDeleteItem
        isOpen={isTypeConfirmationOpen}
        title={'Are you sure?'}
        bodyText={deleteModalText}
        onSubmit={handleOnPropertyTypeChange}
        onCancel={handlePropertyTypeChangeModal}
      />
    </Form>
  );
};

PropertyComponent.propTypes = {
  agency: PropTypes.object,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  manager: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  property: PropTypes.object.isRequired,
  resetForm: PropTypes.func.isRequired,
  setSubmitting: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  onUploaderComplete: PropTypes.func.isRequired,
};

const formikEnhancer = withFormik({
  displayName: 'FormProperty',

  mapPropsToValues: (props) => {
    const { property, manager } = props;
    const {
      address,
      agencyId,
      company,
      entityType,
      id,
      managerId,
      primaryOwner,
      propertyFeature,
      propertyKeys,
      propertyManagementGain,
      propertyType,
    } = property || {};

    const secondaryOwners = props.property.secondaryOwners || [];

    const propertyOwnerships = primaryOwner
      ? [
          defaultPropsForPropertyOwnership(primaryOwner.ownership),
          ...secondaryOwners.map((owner) =>
            defaultPropsForPropertyOwnership(owner.ownership)
          ),
        ]
      : [];

    return {
      id,
      agencyId: agencyId || '',
      propertyType: !manager?.agency?.commercialModuleEnabled
        ? 'residential'
        : propertyType || '',
      managerId: managerId || '',
      address: defaultPropsForAddress(address),
      company: defaultPropsForEntities(company) || {},
      secondaryOwners: secondaryOwners.map((owner) =>
        defaultPropsForUser(owner)
      ),
      primaryOwner: defaultPropsForUser(primaryOwner),
      propertyOwnerships,
      totalSplitOfOwnership: 0,
      entityType,
      propertyKeys: propertyKeys || [],
      propertyFeature: {
        ...defaultPropsForStrata(propertyFeature),
        ...defaultPropsForPropertyFeatures(propertyFeature),
      },
      propertyManagementGain: defaultPropsForManagementGain(
        propertyManagementGain
      ),
      showOwnershipPercentage: props.property.showOwnershipPercentage,
    };
  },

  validationSchema: (props) => {
    const schema = {
      address: Yup.object(validationSchemaForPropertyAddress),
      agencyId: Yup.string().required('Agency is required'),
      propertyType: Yup.string().required('Property type is required'),
      entityType: Yup.mixed().oneOf(['private', 'company']),
      company: Yup.mixed().when('entityType', (entityType, schema) => {
        return entityType === 'company'
          ? Yup.object(validationSchemaForEntities)
          : schema;
      }),
      propertyFeature: Yup.object(validationSchemaForPropertyFeatures),
      propertyOwnerships: Yup.array().of(
        Yup.object().shape(validationSchemaForPropertyOwnership)
      ),
      propertyManagementGain: Yup.object(validationSchemaForManagementGain),
    };

    const isNewProperty = !props.property.id;
    if (isNewProperty) {
      schema.primaryOwner = Yup.object(validationSchemaForUser);
      // If its a new property add validationSchemaForSettings to the schema.
      schema.managementFee = Yup.number()
        .min(1, 'Minimum percentage is 1.00%')
        .required('Management fee is required');

      schema.lettingFeeUnit = Yup.mixed().when(
        'lettingFee',
        (lettingFee, schema) => {
          return lettingFee === 0
            ? schema
            : Yup.mixed()
                .oneOf(['% of annual rent', ' weeks rent'])
                .required('Letting Fee Unit is required');
        }
      );

      schema.leaseRenewalUnit = Yup.mixed().when(
        'leaseRenewal',
        (leaseRenewal, schema) => {
          return leaseRenewal === 0
            ? schema
            : Yup.mixed()
                .oneOf(['% of annual rent', ' weeks rent'])
                .required('Lease Renewal Unit is required');
        }
      );

      schema.lettingFee = Yup.number()
        .min(0, 'Must be a positive number')
        .required('Letting Fee is required');

      schema.leaseRenewal = Yup.number()
        .min(0, 'Must be be a positive number')
        .required('Lease Renewal is required');

      schema.adminFee = Yup.number()
        .min(0, 'Must be a positive number')
        .required('Admin fee is required');

      schema.advertisingFee = Yup.number()
        .min(0, 'Must be a positive number')
        .required('Advertising fee is required');

      schema.workOrderLimit = Yup.number().min(0, 'Must be a positive number');
    } else {
      schema.secondaryOwners = Yup.array().of(
        Yup.object().shape(validationSchemaForUserEdit)
        /** TODO
         * optimize validations for future tasks
         * **/
      );

      schema.totalSplitOfOwnership = Yup.number().oneOf([10000]);
    }

    return Yup.object().shape(schema);
  },

  handleSubmit: (values, { props }) => {
    const {
      address,
      company,
      floatDollars,
      propertyManagementGain,
      primaryOwner,
      secondaryOwners,
      managementFee,
      managerId,
      propertyFeature,
      propertyKeys,
      adminFee,
      advertisingFee,
      workOrderLimit,
      lettingFee,
      leaseRenewal,
      entityType,
      propertyOwnerships,
      propertyType,
      showOwnershipPercentage,
      ...params
    } = values;

    const companyAttributes =
      entityType === 'company' ? company : { ...company, _destroy: true };

    props.onSubmit({
      ...params,
      companyAttributes: companyAttributes,
      managerId,
      addressAttributes: address,
      primaryOwnerPropertyAttributes: {
        ownerAttributes: formatUserForSubmit(primaryOwner),
      },
      secondaryOwnersAttributes: secondaryOwners.map((owner) =>
        formatUserForSubmit(owner)
      ),
      propertyOwnerships: propertyOwnerships.map((ownership, index) =>
        formatPropertyOwnershipForSubmit({
          ownership,
          owner: index > 0 && secondaryOwners[index - 1],
        })
      ),
      propertyFeatureAttributes: propertyFeature,
      propertyKeysAttributes: propertyKeys,
      propertyManagement: propertyManagementGain,
      propertyType: propertyType,
      showOwnershipPercentage: showOwnershipPercentage,
      ...(!props.property.id && {
        lettingFeeMetric: fromPercent(lettingFee),
        leaseRenewalMetric: fromPercent(leaseRenewal),
        floatCents: toCents(floatDollars),
        adminFeeCents: toCents(adminFee),
        percentageManagementFee: fromPercent(managementFee),
        advertisingFeeCents: toCents(advertisingFee),
        workOrderLimitCents: toCents(workOrderLimit),
      }),
    });
  },
});

export const FormProperty = formikEnhancer(PropertyComponent);
