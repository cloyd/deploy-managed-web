import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray } from 'formik';
import capitalize from 'lodash/fp/capitalize';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Button, Col, CustomInput, Row } from 'reactstrap';

import { FormFieldsForUser } from '.';
import { PropertyUserIcon } from '../../modules/Property';
import { getDeleteItemText } from '../../utils';
import { ModalDeleteItem } from '../Modal';

export const FormFieldsForMultipleUsers = ({
  canSubmit,
  type,
  values,
  setFieldValue,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [tenantTypeValue, setTenantTypeValue] = useState('private');
  const tenant = values[index];

  const handleShowDeleteModal = useCallback(
    (index) => () => {
      setIsShowDeleteModal(!isShowDeleteModal);
      if (index) {
        setIndex(index);
      }
    },
    [isShowDeleteModal]
  );

  function renderItems(arrayHelpers) {
    let tenantObj = {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      legalName: '',
      taxNumber: '',
      tenantType: tenantTypeValue,
    };
    const buttonText = `Add a${type === 'owner' ? 'n' : ''} ${type}`;

    function handleAdd() {
      arrayHelpers.push(tenantObj);
    }

    function handleRemove() {
      tenant.id
        ? arrayHelpers.replace(index, { ...tenant, _destroy: 1 })
        : arrayHelpers.remove(index);

      setIsShowDeleteModal(false);
    }

    function handleTenantTypeValueChange(e) {
      setTenantTypeValue(e.target.value);
      let newTenant = values.filter((tenant) => !tenant.id)[0]; // tenant without id in values
      let newTenantIndex = values.findIndex((tenant) => !tenant.id);
      arrayHelpers.replace(newTenantIndex, {
        ...newTenant,
        tenantType: e.target.value,
      });
    }

    return (
      <>
        {values.map((user, index) => (
          <Row
            className={'mb-2 ' + (user._destroy ? 'd-none' : '')}
            key={index}>
            <Col className="d-flex flex-row align-items-center">
              {user.id ? (
                <>
                  {canSubmit && (
                    <button
                      className="btn text-danger"
                      type="button"
                      onClick={handleShowDeleteModal(index)}>
                      <FontAwesomeIcon icon={['far', 'times-circle']} />
                    </button>
                  )}
                  <PropertyUserIcon
                    key={`user-${index}`}
                    className="mb-1 mb-sm-0"
                    disabled={false}
                    role={type}
                    user={user}
                  />
                </>
              ) : (
                <div className="flex-column mt-3">
                  <hr className="w-100 mt-0 mb-3" />
                  <div className="d-flex flex-row mt-4 mb-2">
                    {canSubmit && (
                      <button
                        className="btn text-danger align-self-start"
                        type="button"
                        onClick={handleShowDeleteModal(index)}>
                        <FontAwesomeIcon icon={['far', 'times-circle']} />
                      </button>
                    )}
                    <div className="w-100 d-flex justify-content-end align-items-center">
                      <CustomInput
                        checked={tenantTypeValue === 'private'}
                        id="secondary-tenant-private"
                        className="pr-3"
                        label="Personally"
                        name="tenantTypeValue"
                        type="radio"
                        value="private"
                        onChange={handleTenantTypeValueChange}
                        // disabled={false}
                      />
                      <CustomInput
                        checked={tenantTypeValue === 'company'}
                        id="secondary-tenant-company"
                        label="Company / Trust"
                        name="tenantTypeValue"
                        type="radio"
                        value="company"
                        onChange={handleTenantTypeValueChange}
                        // disabled={false}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row">
                    <FormFieldsForUser
                      className="w-100"
                      key={`user-${index}`}
                      attributeName={`secondary${capitalize(type)}s[${index}]`}
                      isDisabled={false}
                      tenantType={tenantTypeValue}
                      type={type}
                      setFieldValue={setFieldValue}
                      isSearchable
                    />
                  </div>
                </div>
              )}
            </Col>
          </Row>
        ))}
        {canSubmit && (
          <Button
            type="button"
            className={`mt-3 ${
              values.filter((tenant) => !tenant.id).length > 0 && 'd-none'
            }`}
            color="primary"
            onClick={handleAdd}>
            {buttonText}
          </Button>
        )}
        <ModalDeleteItem
          size="md"
          isOpen={isShowDeleteModal}
          title="Are you sure?"
          bodyText={getDeleteItemText(tenant, 'tenant', 'lease')}
          onSubmit={handleRemove}
          onCancel={handleShowDeleteModal()}
        />
      </>
    );
  }

  return (
    <FieldArray name={`secondary${capitalize(type)}s`} render={renderItems} />
  );
};

FormFieldsForMultipleUsers.defaultProps = {
  type: 'owner',
  values: [],
};

FormFieldsForMultipleUsers.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  values: PropTypes.array,
  setFieldValue: PropTypes.func.isRequired,
};
