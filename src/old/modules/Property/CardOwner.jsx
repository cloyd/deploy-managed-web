import PropTypes from 'prop-types';
import React from 'react';
import { Badge, Col, Row } from 'reactstrap';

import { InvalidBankDetailsBadge, PropertyCardRow } from '.';
import {
  featurePropertyImage,
  imageSrcMedium,
  toPercentFormattedAmount,
} from '../../utils';
import { Link } from '../Link';

export const PropertyCardOwner = ({
  disbursementAccount,
  handleProperty,
  ownerPercentageSplit,
  paymentAccount,
  property,
}) => {
  const renderAccount = ({
    account,
    error,
    isShowOwnershipPercentage,
    ownershipPercentage,
    title,
  }) => {
    return (
      <Col sm={6} md={4} className="mt-1 mb-3">
        <h5>
          {title}
          {isShowOwnershipPercentage && ownershipPercentage > 0 && (
            <Badge
              className="ml-1"
              color="primary"
              title="Ownership Percentage"
              style={{ transform: 'scale(0.8, 0.8)' }}>
              {toPercentFormattedAmount(ownershipPercentage)}
            </Badge>
          )}
          {account?.invalid && (
            <InvalidBankDetailsBadge
              className="ml-1"
              isRoundedCorners={true}
              isShowText={false}
            />
          )}
        </h5>
        {ownerPercentageSplit === 0 && property.primaryOwner ? (
          <Link
            href={`/contacts/owners/${property.primaryOwner.id}`}
            data-testid="card-owner-primary-link">
            see primary owner
          </Link>
        ) : account && account.routingNumber ? (
          <>
            <strong>Bank: </strong> {account.bankName}
            <br />
            <strong>Name: </strong> {account.accountName}
            <br />
            <strong>Acc #:</strong> {account.routingNumber}-
            {account.accountNumber}
          </>
        ) : account && account.number ? (
          <>
            <strong>Card number: </strong> {account.number}
          </>
        ) : error ? (
          <p>{error}</p>
        ) : null}
      </Col>
    );
  };

  renderAccount.propTypes = {
    title: PropTypes.string,
    account: PropTypes.object,
    error: PropTypes.string,
    isShowOwnershipPercentage: PropTypes.bool,
    ownershipPercentage: PropTypes.number,
  };

  return (
    <Row className="my-4" data-testid="property-card-owner">
      <Col xs={12} onClick={handleProperty(property)}>
        <PropertyCardRow
          property={property}
          imageSrc={imageSrcMedium(featurePropertyImage(property.attachments))}
        />
      </Col>
      {renderAccount({
        title: 'Disbursement account',
        account: disbursementAccount,
        error: 'No disbursement account set',
        isShowOwnershipPercentage: property.showOwnershipPercentage,
        ownershipPercentage: ownerPercentageSplit,
      })}
      {renderAccount({
        title: 'Payment account',
        account: paymentAccount,
        error: 'Paying via rent',
      })}
    </Row>
  );
};

PropertyCardOwner.propTypes = {
  disbursementAccount: PropTypes.object,
  handleProperty: PropTypes.func,
  ownerPercentageSplit: PropTypes.number,
  paymentAccount: PropTypes.object,
  property: PropTypes.object,
};

PropertyCardOwner.defaultProps = {};
