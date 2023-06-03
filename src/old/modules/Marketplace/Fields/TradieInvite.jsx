import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Col, CustomInput, FormGroup, Row } from 'reactstrap';
import * as Yup from 'yup';

import { useMarketplaceTags } from '../../../modules/Marketplace/hooks';
import {
  fetchMarketplaceTags,
  getMarketplaceTags,
} from '../../../redux/marketplace';
import { AUSTRALIA_STATES_TERRITORIES } from '../../../redux/property';
import { FormField, FormFieldSelect, FormLabel } from '../../Form';

const DEFAULT_TRADIE_VALUES = {
  businessName: '',
  tradeCategory: [],
  suburb: '',
  state: '',
  postcode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredTradie: false,
};

export const mapTradieInviteFieldsProps = (
  tradie = DEFAULT_TRADIE_VALUES,
  search
) => {
  let params = DEFAULT_TRADIE_VALUES;

  if (typeof search === 'string') {
    if (search.match(/^\d+$/g)) {
      params.phone = search; // Set numeric search string as phone number
    } else {
      params.email = search;
    }
  } else {
    params = tradie;
  }

  return params;
};

export const validationSchemaForTradieInviteFields = {
  businessName: Yup.string().required('Business name is required'),
  tradeCategory: Yup.string().required('Trade category is required'),
  suburb: Yup.string().required('Business suburb is required'),
  state: Yup.string().required('Business state is required'),
  postcode: Yup.number()
    .required('Postcode is required')
    .typeError('Must be a number'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  preferredTradie: Yup.boolean(),
};

export const MarketplaceFieldsTradieInvite = ({
  setFieldValue,
  values,
  errors,
}) => {
  const marketplaceTags = useSelector((state) =>
    getMarketplaceTags(state.marketplace)
  );

  const { marketplaceTagFormOptions } = useMarketplaceTags(
    marketplaceTags,
    fetchMarketplaceTags
  );

  const handleSelectTag = useCallback(
    (value) => setFieldValue('tradeCategory', value),
    [setFieldValue]
  );

  const handlePreferredTradie = useCallback(() => {
    setFieldValue('preferredTradie', !values.preferredTradie);
  }, [setFieldValue, values.preferredTradie]);

  return (
    <>
      <Row>
        <Col>
          <p>Let’s get some information to get your tradie set up</p>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="businessName" isRequired>
              Business Name
            </FormLabel>
            <FormField data-testid="field-business-name" name="businessName" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="tradeCategory" isRequired>
              Creditor Type
            </FormLabel>
            <FormFieldSelect
              data-testid="field-trade-category"
              error={errors.tradeCategory}
              options={marketplaceTagFormOptions}
              onChange={handleSelectTag}
              value={values.tradeCategory}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormLabel for="suburb">Business Address</FormLabel>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <FormGroup>
            <FormLabel for="suburb" isRequired>
              Suburb
            </FormLabel>
            <FormField data-testid="field-business-suburb" name="suburb" />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel for="state" isRequired>
              State
            </FormLabel>
            <FormField
              data-testid="field-business-state"
              name="state"
              type="select">
              <option value="">-- Please Select --</option>
              {Object.entries(AUSTRALIA_STATES_TERRITORIES).map((state) => (
                <option key={`state-${state[0]}`} value={state[0]}>
                  {state[0]}
                </option>
              ))}
            </FormField>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <FormLabel for="postcode" isRequired>
              Postcode
            </FormLabel>
            <FormField data-testid="field-post-code" name="postcode" />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="firstName" isRequired>
              First Name
            </FormLabel>
            <FormField
              data-testid="field-contact-first-name"
              name="firstName"
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="lastName" isRequired>
              Last Name
            </FormLabel>
            <FormField data-testid="field-contact-last-name" name="lastName" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="email" isRequired>
              Contact Email
            </FormLabel>
            <FormField data-testid="field-contact-email" name="email" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <FormLabel for="phone" isRequired>
              Contact Phone
            </FormLabel>
            <FormField data-testid="field-contact-phone" name="phone" />
          </FormGroup>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <FormGroup>
            <CustomInput
              name="preferredTradie"
              id="field-preferred-tradie"
              type="checkbox"
              label={<span className="font-weight-bold">Preferred Trade</span>}
              onChange={handlePreferredTradie}
              checked={values.preferredTradie}
              disabled={values.isPreferred}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

MarketplaceFieldsTradieInvite.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
};
