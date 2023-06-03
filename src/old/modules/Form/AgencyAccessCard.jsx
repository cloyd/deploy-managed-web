import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, CustomInput, Form, FormGroup, Row } from 'reactstrap';

import { FormButtons } from '.';
import { withOnComplete } from './withOnComplete';

const FormAgencyAccessComponent = (props) => {
  const { handleSubmit, isSubmitting, manager, onCancel, setFieldValue } =
    props;
  const [agencies, setAgencies] = useState([]);

  const getManagerAgencyId = useCallback(
    (value) => {
      const item = manager.managerAgencies.filter((i) => {
        if (i.agencyId === value.id) {
          return i.id;
        }
      });

      return item.length > 0 ? item[0].id : undefined;
    },
    [manager.managerAgencies]
  );

  const handleChange = useCallback(
    (e) => {
      const updatedAgencies = agencies.map((agency) => {
        return String(agency.id) === e.target.value
          ? { ...agency, checked: e.target.checked }
          : agency;
      });

      setAgencies(updatedAgencies);

      props.handleChange(e);
    },
    [agencies, props]
  );

  useEffect(() => {
    const agencies = manager.allowedAgencies.map((agency) => {
      return {
        id: agency.id,
        managerAgencyId: getManagerAgencyId(agency),
        isPrimary: agency.id === manager.agency.id,
        name: agency.tradingName,
        checked: manager.managerAgencies.some(
          ({ agencyId }) => agencyId === agency.id
        ),
      };
    });

    setAgencies(agencies);
  }, [
    getManagerAgencyId,
    manager.agency.id,
    manager.allowedAgencies,
    manager.managerAgencies,
  ]);

  useEffect(() => {
    const managerAgenciesAttributes = agencies.map((agency) => {
      return {
        agencyId: agency.id,
        id: agency.managerAgencyId,
        isPrimary: agency.id === manager.agency.id,
        managerId: manager.id,
        _destroy: !agency.checked,
      };
    });

    setFieldValue('managerAgenciesAttributes', managerAgenciesAttributes);
  }, [agencies, manager.agency.id, manager.id, setFieldValue]);

  return (
    <Form onSubmit={handleSubmit} data-testid="form-agency-access">
      <FormGroup>
        <Row>
          {agencies.map((agency, index) => (
            <Col key={`agency-${agency.id}`} xs={6} sm={3}>
              <CustomInput
                checked={agency.checked}
                disabled={agency.isPrimary}
                id={agency.id}
                inline={true}
                label={`${agency.name}${agency.isPrimary ? ' (default)' : ''}`}
                name={`agencies[${index}]`}
                type="checkbox"
                value={agency.id}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>
      </FormGroup>
      <FormButtons onCancel={onCancel} isSubmitting={isSubmitting} />
    </Form>
  );
};

FormAgencyAccessComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  manager: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};

const config = {
  displayName: 'FormAgencyAccess',

  mapPropsToValues: (props) => {
    return {
      id: props.manager.id,
      managerAgenciesAttributes: [],
    };
  },

  handleSubmit: (values, { props }) => {
    const { id, managerAgenciesAttributes } = values;
    return props.onSubmit({ id, managerAgenciesAttributes });
  },
};

export const FormAgencyAccess = compose(
  withFormik(config),
  withOnComplete
)(FormAgencyAccessComponent);
