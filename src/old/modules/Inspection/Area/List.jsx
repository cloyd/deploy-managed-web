import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

import { InspectionAreaItemCreate, InspectionAreaListItem } from '..';

export const InspectionAreaList = (props) => {
  const { areas, onSubmit, isArchived } = props;
  const showAllItems = props.isLiveCondition || !!onSubmit;

  return (
    <Row data-testid="inspection-area-list">
      {areas.map((area) =>
        area && (showAllItems || area.itemsCount?.overallChecked > 0) ? (
          <Col key={`area-${area.id}`} sm={6} lg={3} className="mt-3">
            <InspectionAreaListItem
              area={area}
              isIngoingReport={props.isIngoingReport}
              isLiveCondition={props.isLiveCondition}
              path={props.path}
              permissionsStatus={props.permissionsStatus}
              onDelete={props.onDelete}
              isArchived={isArchived}
            />
          </Col>
        ) : null
      )}
      {onSubmit && (
        <Col md={6} lg={3} className="mt-3">
          <InspectionAreaItemCreate
            onSubmit={onSubmit}
            isArchived={isArchived}
          />
        </Col>
      )}
    </Row>
  );
};

InspectionAreaList.propTypes = {
  areas: PropTypes.array,
  children: PropTypes.node,
  isIngoingReport: PropTypes.bool,
  isLiveCondition: PropTypes.bool,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  path: PropTypes.string,
  permissionsStatus: PropTypes.shape({
    isDraft: PropTypes.bool,
    isPendingAgency: PropTypes.bool,
    isPendingTenant: PropTypes.bool,
  }),
  isArchived: PropTypes.bool,
};

InspectionAreaList.defaultProps = {
  path: '',
};
