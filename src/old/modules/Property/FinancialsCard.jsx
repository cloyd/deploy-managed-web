import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, Col, Row } from 'reactstrap';

import { centsToDollar, fullName } from '../../utils';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';

export const PropertyFinancialsCard = (props) => {
  const { company, financials, secondaryOwners } = props;

  return (
    <CardLight className="d-flex h-100 mb-4">
      <CardBody>
        {company && (
          <Row className="mb-2">
            <Col className="mb-2 mb-lg-0">
              <ContentDefinition
                label="Company Name"
                value={company.legalName || ''}
              />
            </Col>
            <Col className="mb-2 mb-lg-0">
              <ContentDefinition
                label="ABN/ACN"
                value={company.taxNumber || ''}
              />
            </Col>
            <Col className="mb-2 mb-lg-0">
              <ContentDefinition label="Company Address">
                <div className="address h6-font-size">
                  {company.addressLine1}
                  <br />
                  {company.city}, {company.state}, {company.zip}
                </div>
              </ContentDefinition>
            </Col>
          </Row>
        )}
        <Row className="mb-2">
          <Col className="mb-2 mb-lg-0">
            {!company && (
              <ContentDefinition label="Owner(s)">
                {financials.landlordName || ''}
                {secondaryOwners &&
                  secondaryOwners.map((owner) => (
                    <div className="d-block" key={owner.id}>
                      {fullName(owner)}
                    </div>
                  ))}
              </ContentDefinition>
            )}
          </Col>
          <Col className="mb-2 mb-lg-0">
            {!company && (
              <ContentDefinition
                label="Principal owner address"
                value={financials.landlordAddress || ''}
              />
            )}
          </Col>
          <Col className="mb-2 mb-lg-0">
            <ContentDefinition label="Managing agency">
              {financials.agencyName && <div>{financials.agencyName}</div>}
              {financials.agencyCompanyName && (
                <div>{financials.agencyCompanyName}</div>
              )}
              {financials.agencyAbn && <div>{financials.agencyAbn}</div>}
              {financials.agencyAddress && (
                <div>{financials.agencyAddress}</div>
              )}
            </ContentDefinition>
          </Col>
        </Row>
        <Row>
          <Col>
            <ContentDefinition
              label="Weekly rent"
              value={centsToDollar(financials.weeklyRentCents)}
            />
          </Col>
          <Col>
            <ContentDefinition
              label="Tenant paid to date"
              value={financials.rentPaidUpUntil}
            />
          </Col>
          <Col>
            <ContentDefinition
              label="Wallet balance"
              value={centsToDollar(financials.walletBalanceAmountCents)}
            />
          </Col>
        </Row>
      </CardBody>
    </CardLight>
  );
};

PropertyFinancialsCard.propTypes = {
  company: PropTypes.object,
  financials: PropTypes.object.isRequired,
  secondaryOwners: PropTypes.array,
};
