import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { isStrataByLaws } from '../../utils';
import { CardLight } from '../Card';
import { ContentDefinition } from '../Content';
import { UploaderFiles } from '../Uploader';

export const PropertyStrataCard = ({ property = {}, ...props }) => {
  const { id, strataDetails } = property;
  const attachments = (property.attachments || []).filter(isStrataByLaws);

  return (
    <CardLight title="Strata" {...props}>
      <ContentDefinition
        label="Company name"
        value={strataDetails.strataCompanyName}
        className="d-block mb-3"
      />
      <Row>
        <Col>
          <ContentDefinition
            className="d-block mb-3"
            label="Plan number"
            value={strataDetails.strataPlanNumber}
          />
        </Col>
        <Col>
          <ContentDefinition
            className="d-block mb-3"
            label="Lot number"
            value={strataDetails.strataLotNumber}
          />
        </Col>
      </Row>
      <ContentDefinition
        className="d-block mb-3"
        label="Email"
        value={strataDetails.strataEmail}
      />
      <ContentDefinition
        className="d-block mb-3"
        label="Phone"
        value={strataDetails.strataPhoneNumber}
      />
      <ContentDefinition label="By-Laws">
        {attachments.length > 0 && (
          <UploaderFiles
            attachments={attachments}
            attachableType="Property"
            attachableId={id}
            className="d-flex flex-wrap mb-0"
          />
        )}
      </ContentDefinition>
    </CardLight>
  );
};

PropertyStrataCard.propTypes = {
  property: PropTypes.object.isRequired,
};
