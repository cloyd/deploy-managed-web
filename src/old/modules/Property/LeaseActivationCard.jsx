import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardImg } from 'reactstrap';

export const PropertyLeaseActivationCard = ({ property, lease, imageSrc }) => {
  const { address } = property;

  return (
    <Card className="shadow-sm">
      <CardBody className="d-flex p-2 p-md-3">
        {imageSrc && (
          <div style={{ maxWidth: '114px' }}>
            <CardImg src={imageSrc} />
          </div>
        )}
        <div className="d-flex flex-column justify-content-center pl-3">
          <p className="mb-0">
            <strong className="md-font-size mr-2">Deposit paid</strong>
            {/* <small className="text-muted">23/5/2018</small> */}
          </p>
          <span>
            {`
              ${address.street},
              ${address.suburb},
              ${address.state},
              ${address.postcode}
            `}
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

PropertyLeaseActivationCard.propTypes = {
  property: PropTypes.object.isRequired,
  lease: PropTypes.object, // TODO: set isRequired when endpoint available
  imageSrc: PropTypes.string,
};
