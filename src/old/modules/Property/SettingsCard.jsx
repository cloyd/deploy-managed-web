import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap';

import { useIsOpen } from '../../hooks';
import { centsToDollar, toPercent } from '../../utils';
import { ButtonEdit } from '../Button';
import { CardLight } from '../Card';
import { FormSettings } from '../Form';

export const PropertySettingsCard = (props) => {
  const {
    canEdit,
    hasError,
    isLoading,
    owner,
    property,
    onSubmit,
    dischargeFloat,
  } = props;
  const handleDischarge = useCallback(() => {
    const { floatCents, floatBalanceAmountCents, leaseId } = property;
    const amountCents = floatBalanceAmountCents - floatCents;

    amountCents > 0 && dischargeFloat({ leaseId, amountCents });
  }, [dischargeFloat, property]);

  const [isOpen, actions] = useIsOpen(handleDischarge);
  const { handleSubmit: handleOnComplete } = actions;

  return (
    <CardLight>
      <CardHeader className="d-flex justify-content-between bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          <FontAwesomeIcon
            icon={['far', 'cog']}
            className="text-primary mr-2"
          />
          Settings
        </CardTitle>
        {canEdit && <ButtonEdit onClick={actions.handleOpen}>Edit</ButtonEdit>}
      </CardHeader>
      <CardBody>
        {isOpen ? (
          <FormSettings
            hasError={hasError}
            isLoading={isLoading}
            owner={owner}
            property={property}
            onSubmit={onSubmit}
            onCancel={actions.handleClose}
            onComplete={handleOnComplete}
          />
        ) : (
          <>
            <Row>
              <Col xs={8} lg={5} xl={4}>
                <strong>Management Fee:</strong>
              </Col>
              <Col xs={4} lg={7} xl={8}>
                {toPercent(property.percentageManagementFee)}%
              </Col>
            </Row>
            <Row>
              <Col xs={8} lg={5} xl={4}>
                <strong>Wallet Amount:</strong>
              </Col>
              <Col xs={4} lg={7} xl={8}>
                {centsToDollar(property.floatCents)}
              </Col>
            </Row>
          </>
        )}
      </CardBody>
    </CardLight>
  );
};

PropertySettingsCard.propTypes = {
  canEdit: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  owner: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  dischargeFloat: PropTypes.func.isRequired,
};
