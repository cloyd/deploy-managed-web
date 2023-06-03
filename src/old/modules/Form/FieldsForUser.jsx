import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Col, FormGroup, FormText, Row } from 'reactstrap';
import * as Yup from 'yup';

import { USER_TYPES } from '@app/redux/users';

import {
  FormField,
  FormFieldSearchUser,
  FormFieldSelect,
  FormFieldsForAddress,
  FormLabel,
  validationSchemaForAddress,
} from '.';
import { useIsMobile } from '../../hooks';
import { selectAgencies } from '../../redux/agency';
import { formatPhoneNumber, removeSpaces } from '../../utils';
import { useRolesContext } from '../Profile';

export const defaultPropsForUser = (props = {}) => {
  const tenantType =
    props.tenantType === 'company' || props.kind === 'company'
      ? 'company'
      : 'private';
  return {
    agencyId: props.agency ? props.agency.id : undefined,
    email: props.email,
    firstName: props.firstName,
    id: props.id,
    isAuthyEnabled: props.isAuthyEnabled || false,
    lastName: props.lastName,
    phoneNumber: formatPhoneNumber(props.phoneNumber),
    status: props.status,
    tenantType: tenantType,
    companyName: props?.company?.legalName,
    taxNumber: props?.company?.taxNumber,
    address: {
      street: props?.company?.addressLine1,
      postcode: props?.company?.zip,
      state: props?.company?.state,
      suburb: props?.company?.city,
    },
    agencyNote: props.agencyNote?.body,
    active: props.active,
  };
};

export const validationSchemaForUser = {
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phoneNumber: Yup.string()
    .transform((value) => value.replace(/\s/g, ''))
    .matches(/^$|^(\+?[0-9]{2})?[0-9]{10}$/, 'Valid mobile number is required'),
  companyName: Yup.string().when('tenantType', {
    is: 'company',
    then: Yup.string().required('Company name is required'),
  }),
  taxNumber: Yup.string().when('tenantType', {
    is: 'company',
    then: Yup.string().required('Tax number is required'),
  }),
  address: Yup.object().when(['tenantType', 'id'], {
    is: (tenantType, id) => tenantType === 'company' && id,
    then: Yup.object(validationSchemaForAddress),
  }),
  tenantType: Yup.string(),
};

export const validationSchemaForUserEdit = {
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  companyName: Yup.string().when('tenantType', {
    is: 'company',
    then: Yup.string().required('Company name is required'),
  }),
  taxNumber: Yup.string().when('tenantType', {
    is: 'company',
    then: Yup.string().required('Tax number is required'),
  }),
  address: Yup.object().when(['tenantType', 'id'], {
    is: (tenantType, id) => tenantType === 'company' && id,
    then: Yup.object(validationSchemaForAddress),
  }),
  tenantType: Yup.string(),
};

export const formatUserForSubmit = (values) => {
  let userValues = {
    id: values.id,
    _destroy: values._destroy,
    user_attributes: {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber ? removeSpaces(values.phoneNumber) : '',
    },
  };
  if (values.tenantType === 'company') {
    userValues['companyAttributes'] = {
      legalName: values.companyName,
      taxNumber: values.taxNumber,
      address_line1: values.address.street,
      city: values.address.suburb,
      state: values.address.state,
      zip: values.address.postcode,
    };
  }
  if (values.role === 'tenant' || values.role === 'owner') {
    userValues['agency_note_attributes'] = formatAgencyNoteForSubmit(values);
  }
  return userValues;
};

export const formatAgencyNoteForSubmit = (values) => {
  return {
    body: values.agencyNote?.trim() || '',
    ...(values.agencyNoteId && { id: values.agencyNoteId }),
  };
};

const fieldName = (key, attributeName) =>
  attributeName ? `${attributeName}.${key}` : key;

export const FormFieldsForUser = ({
  className,
  attributeName,
  isAuthyEnabled,
  isDisabled,
  isArchived,
  tenantType,
  userId,
  isCreate,
  isAgencyShown,
  isSearchable,
  setFieldValue,
  type,
  values,
  errors,
  touched,
}) => {
  const { isCorporateUser } = useRolesContext();
  const agencies = useSelector(selectAgencies);

  const isMobile = useIsMobile();
  const mobileFieldName = useMemo(
    () => fieldName('phoneNumber', attributeName),
    [attributeName]
  );

  const agencyOptions = useMemo(
    () =>
      agencies.length
        ? agencies.map((agency) => ({
            label: agency.tradingName,
            value: agency.id,
          }))
        : [],
    [agencies]
  );

  const handleMobileInputChange = useCallback(
    (e) => {
      const formattedPhoneNumber = formatPhoneNumber(e.target.value);
      setFieldValue(mobileFieldName, formattedPhoneNumber);
    },
    [setFieldValue, mobileFieldName]
  );

  const handleSelectAgency = useCallback(
    (option) => {
      setFieldValue('agencyId', option.value);
    },
    [setFieldValue]
  );

  const handleUserSelect = useCallback(
    (_, data) => {
      if (isSearchable && data && data.length) {
        const [values] = data;
        setFieldValue(fieldName('lastName', attributeName), values.lastName);
        setFieldValue(fieldName('firstName', attributeName), values.firstName);
        setFieldValue(fieldName('email', attributeName), values.email);
      }
    },
    [attributeName, setFieldValue, isSearchable]
  );

  const handleCustomUserInput = useCallback(
    (value) => {
      if (isSearchable) {
        setFieldValue(fieldName('email', attributeName), value);
      }
    },
    [attributeName, setFieldValue, isSearchable]
  );

  return (
    <fieldset disabled={isDisabled || isArchived} className={className}>
      <FormGroup>
        {tenantType === 'company' && type === 'tenant' && (
          <Row className="mb-3">
            <Col xs={12} className="px-3">
              <FormLabel
                for={fieldName('companyName', attributeName)}
                isRequired>
                Company Name
              </FormLabel>
              <FormField
                data-testid="field-user-company-name"
                name={fieldName('companyName', attributeName)}
              />
            </Col>
          </Row>
        )}
        {tenantType === 'company' && type === 'tenant' && (
          <Row className="mb-3">
            <Col xs={12} className="px-3">
              <FormLabel for={fieldName('taxNumber', attributeName)} isRequired>
                ABN/ACN
              </FormLabel>
              <FormField
                data-testid="field-user-tax-number"
                name={fieldName('taxNumber', attributeName)}
              />
            </Col>
          </Row>
        )}
        {/* Show address field only for tenant type - company - in edit Mode */}
        {tenantType === 'company' && type === 'tenant' && userId && (
          <FormFieldsForAddress isAustralianAddress={true} />
        )}
        <Row className="mb-3">
          <Col xs={12} md={6} className={`pr-2 ${isMobile && 'mb-3'}`}>
            <FormLabel for={fieldName('firstName', attributeName)} isRequired>
              {tenantType === 'company' && type === 'tenant'
                ? 'Contact First name'
                : 'First name'}
            </FormLabel>
            <FormField
              data-testid="field-user-first-name"
              name={fieldName('firstName', attributeName)}
            />
          </Col>
          <Col xs={12} md={6} className={`${!isMobile && 'pl-2'}`}>
            <FormLabel for={fieldName('lastName', attributeName)} isRequired>
              {tenantType === 'company' && type === 'tenant'
                ? 'Contact Last name'
                : 'Last name'}
            </FormLabel>
            <FormField
              data-testid="field-user-last-name"
              name={fieldName('lastName', attributeName)}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} md={6} className={`pr-2 ${isMobile && 'mb-3'}`}>
            <FormLabel for={fieldName('email', attributeName)} isRequired>
              Email
            </FormLabel>
            {isSearchable ? (
              <FormFieldSearchUser
                data-testid="field-user-email"
                name={fieldName('email', attributeName)}
                type={USER_TYPES[type]}
                onChange={handleUserSelect}
                onInputChange={handleCustomUserInput}
              />
            ) : (
              <FormField
                data-testid="field-user-email"
                name={fieldName('email', attributeName)}
              />
            )}
          </Col>
          <Col xs={12} md={6} className={`${!isMobile ? 'pl-2' : 'mb-2'}`}>
            <FormLabel
              for={fieldName('phoneNumber', attributeName)}
              helpText="This mobile number will be used for SMS communications">
              Mobile
            </FormLabel>
            <FormField
              data-testid="field-user-phone-number"
              name={fieldName('phoneNumber', attributeName)}
              placeholder="(+00) 0400 000 000"
              readOnly={isAuthyEnabled}
              onChange={handleMobileInputChange}
            />
            {isAuthyEnabled && (
              <FormText>
                <FontAwesomeIcon icon={['far', 'lock']} /> Disable two-factor
                authentication to unlock mobile
              </FormText>
            )}
          </Col>
        </Row>

        {isCorporateUser && isAgencyShown && (
          <Row className="mb-3">
            <Col xs={12} md={6} className={`pr-2 ${isMobile && 'mb-3'}`}>
              <FormLabel for={fieldName('agencyId', attributeName)} isRequired>
                Primary Agency
              </FormLabel>
              <input
                type="hidden"
                name={fieldName('agencyId', attributeName)}
              />
              <FormFieldSelect
                data-testid="field-user-agency"
                isMulti={false}
                error={touched.agencyId ? errors.agencyId : ''}
                options={agencyOptions}
                onChange={handleSelectAgency}
                value={values.agencyId}
                isDisabled={!isCreate}
              />
            </Col>
          </Row>
        )}
        {/* Show Agency notes only in edit mode while editing a Tenant or Owner */}
        {userId && (type === 'owner' || type === 'tenant') && (
          <Row>
            <Col xs={12} className="pr-2">
              <FormLabel for={fieldName('agencyNote', attributeName)}>
                Agency Notes
              </FormLabel>
              <FormField
                data-testid="field-user-agencyNote"
                name={fieldName('agencyNote', attributeName)}
                rows={4}
                type="textarea"
              />
            </Col>
          </Row>
        )}
      </FormGroup>
    </fieldset>
  );
};

FormFieldsForUser.defaultProps = {
  isAuthyEnabled: false,
  isAgencyShown: false,
  isSearchable: false,
};

FormFieldsForUser.propTypes = {
  className: PropTypes.string,
  isAuthyEnabled: PropTypes.bool,
  isDisabled: PropTypes.bool.isRequired,
  attributeName: PropTypes.string,
  isArchived: PropTypes.bool,
  tenantType: PropTypes.string,
  userId: PropTypes.number,
  setFieldValue: PropTypes.func.isRequired,
  isCreate: PropTypes.bool,
  isAgencyShown: PropTypes.bool,
  isSearchable: PropTypes.bool,
  type: PropTypes.string,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
};
