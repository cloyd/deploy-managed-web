import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { ExternalCreditorRecommendations } from '@app/modules/ExternalCreditor';
import { Link } from '@app/modules/Link';
import { useMarketplaceTagsToString } from '@app/modules/Marketplace';
import { UserStatus } from '@app/modules/User';

import { EXTERNAL_CREDITOR_CLASSIFICATIONS } from '../../redux/users';

export const ExternalCreditorHeader = ({ tradie }) => {
  const history = useHistory();
  const tags = useMarketplaceTagsToString(tradie.tagIds);

  const isContactPage = history.location.pathname.includes(
    '/contacts/preferred-tradies/tradie/'
  );
  const isTradie =
    tradie?.classification === EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie;

  const handleClickBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div className="py-3 bg-white">
      <Container>
        <div className="mb-3 d-flex justify-content-between">
          <Link className="p-0" onClick={handleClickBack}>
            <FontAwesomeIcon className="mr-1" icon={['far', 'chevron-left']} />
            Back
          </Link>
          {isTradie && (
            <Link
              className="text-capitalize"
              color="primary"
              size="sm"
              to={`/marketplace/tradie/${tradie.id}/financials`}>
              Financials
            </Link>
          )}
        </div>
        <Row className="align-items-stretch">
          <Col xs={12} lg={6}>
            <h2>{tradie.promisepayUserPromisepayCompanyLegalName}</h2>
            <h3 className="font-weight-light">{tradie.name}</h3>
            {!!tags.length && <p>Tags: {tags}</p>}
            <h5 className="text-muted font-weight-lighter">
              {startCase(tradie.typeOf)}
            </h5>
            {isContactPage && <UserStatus status={tradie.status} />}
          </Col>
          <Col xs={12} lg={6} className="d-flex flex-column text-right">
            <p className="mb-0">
              {tradie.primaryContactEmail && (
                <span className="d-inline-block text-nowrap mb-2">
                  <FontAwesomeIcon
                    className="mr-2"
                    icon={['far', 'envelope']}
                    size="lg"
                  />
                  <a
                    href={`mailto:${tradie.primaryContactEmail}`}
                    className="btn-link mr-3">
                    {tradie.primaryContactEmail}
                  </a>
                </span>
              )}
              {tradie.primaryContactMobile && (
                <span className="d-inline-block text-nowrap mb-2">
                  <FontAwesomeIcon
                    className="mr-2"
                    icon={['far', 'phone']}
                    size="lg"
                  />
                  <a
                    href={`tel:${tradie.primaryContactMobile}`}
                    className="btn-link">
                    {tradie.primaryContactMobile}
                  </a>
                </span>
              )}
            </p>
            {!!tradie.preferredAgencies.length && (
              <div className="mt-4 mb-2">
                <p className="text-muted mb-1">Preferred by</p>
                <div className="row justify-content-end mx-0">
                  {tradie.preferredAgencies.map((agency) => (
                    <small
                      key={agency.id}
                      className="col-auto badge badge-pill badge-light bg-gray-200 text-muted ml-2">
                      {agency.tradingName}
                    </small>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>
        <hr />
        <ExternalCreditorRecommendations tradie={tradie} />
      </Container>
    </div>
  );
};

ExternalCreditorHeader.propTypes = {
  tradie: PropTypes.object,
};
