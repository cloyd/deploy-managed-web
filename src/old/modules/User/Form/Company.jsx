import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Col, Form, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { useAsyncPostcodeSearch } from '../../../hooks';
import {
  FormButtons,
  FormField,
  FormFieldsForCompany,
  FormLabel,
  mapCompanyFieldProps,
  validationSchemaForCompany,
} from '../../Form';
import { withOnComplete } from '../../Form/withOnComplete';
import { GoogleMap } from '../../GoogleAPI';

const AUSTRALIA_POSTCODE_DIGITS = 4;

const UserFormCompanyComponent = (props) => {
  const {
    errors,
    handleSubmit,
    hasServiceRadius,
    isSubmitting,
    isValid,
    dirty,
    onCancel,
    setFieldValue,
    values,
  } = props;

  const [handleSearchPostcodes, { handleResetPostcodes, postcodes }] =
    useAsyncPostcodeSearch();

  const postcodeSearchResult = useMemo(
    () => (postcodes && postcodes.length > 0 ? postcodes[0] : null),
    [postcodes]
  );

  useEffect(() => {
    if (
      hasServiceRadius &&
      (!errors.address || !errors.address.postcode) &&
      values.address.postcode &&
      values.address.postcode.length === AUSTRALIA_POSTCODE_DIGITS
    ) {
      handleSearchPostcodes(values.address.postcode);
    } else {
      handleResetPostcodes();
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [values.address.postcode]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Form data-testid="user-form-company" onSubmit={handleSubmit}>
      <FormFieldsForCompany setFieldValue={setFieldValue}>
        {props.hasServiceRadius && (
          <Row>
            <Col md={6}>
              <FormGroup>
                <FormLabel className="ml-1" for="servicingRadiusKm" isRequired>
                  Service Radius (km)
                </FormLabel>
                <FormField
                  data-testid="field-company-service-radius"
                  name="servicingRadiusKm"
                  type="number"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              {postcodeSearchResult && values.servicingRadiusKm && (
                <GoogleMap
                  className="mb-3"
                  latitude={postcodeSearchResult.latitude}
                  longitude={postcodeSearchResult.longitude}
                  radiusInKm={parseInt(values.servicingRadiusKm, 10)}
                />
              )}
            </Col>
          </Row>
        )}
      </FormFieldsForCompany>
      <FormButtons
        isRequired
        isSubmitting={isSubmitting}
        isValid={isValid && dirty}
        onCancel={onCancel}
      />
    </Form>
  );
};

UserFormCompanyComponent.propTypes = {
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  hasServiceRadius: PropTypes.bool,
  isSubmitting: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
};

const config = {
  displayName: 'UserFormCompany',
  enableReinitialize: true,

  // Map address to defaultPropsForAddress format.
  mapPropsToValues: (props) => {
    const { company, hasServiceRadius } = props;

    return {
      ...mapCompanyFieldProps(company),
      hasServiceRadius,
      servicingRadiusKm: company.servicingRadiusKm,
    };
  },

  validationSchema: () =>
    Yup.object().shape({
      ...validationSchemaForCompany,
      servicingRadiusKm: Yup.number().when('hasServiceRadius', {
        is: true,
        then: Yup.number()
          .required('Service radius is required')
          .min(1, 'Service radius must be greater than 1km'),
      }),
    }),

  handleSubmit: (values, { props }) => {
    const {
      address,
      legalName,
      licenseNumber,
      ownerId,
      ownerType,
      servicingRadiusKm,
      taxNumber,
    } = values;
    const { postcode, street, suburb, ...paramsAddress } = address;

    // Map address back to format required by assembly.
    props.onSubmit({
      ...paramsAddress,
      addressLine1: street,
      city: suburb,
      zip: postcode,
      legalName,
      licenseNumber,
      ownerId,
      ownerType,
      servicingRadiusKm,
      taxNumber,
    });
  },
};

export const UserFormCompany = compose(
  withFormik(config),
  withOnComplete
)(UserFormCompanyComponent);
