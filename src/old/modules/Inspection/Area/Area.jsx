import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { CardBody, CardHeader, Col, Row } from 'reactstrap';

import {
  InspectionAreaItem,
  InspectionAreaOverview,
  InspectionFormAreaCreate,
} from '..';
import { useComposeAccordion, useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';
import { CardLight } from '../../Card';

export const InspectionArea = (props) => {
  const {
    area,
    isShowOverview,
    items,
    resetAreaItemCondition,
    resetOverviewCondition,
  } = props;

  const [isCreatingItem, actions] = useIsOpen(props.onCreateItem);
  const [accordionState, accordionActions] = useComposeAccordion();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const numItems = isShowOverview ? items.length + 1 : items.length;
    accordionActions.initState(numItems);
  }, [items.length, isShowOverview]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <CardLight className="border-0">
      <InspectionAreaTableHeader canAgree={!!props.onTenantAgreeItem} />
      <CardBody className="p-0">
        {isShowOverview && (
          <div ref={accordionActions.handleRef(0)}>
            <InspectionAreaOverview
              accordionSection={{
                isOpen: accordionState.openIndex === 0,
                onClose: () => accordionActions.close(0),
                onNext: () => accordionActions.next(0),
                onOpen: () => accordionActions.open(0),
              }}
              area={area}
              hasNextItem={items.length > 0}
              role={props.role}
              onManagerCheckItem={props.onManagerCheckItem}
              onUpdate={props.onUpdateArea}
              onUploaderComplete={props.onUploaderComplete}
              resetOverviewCondition={resetOverviewCondition}
            />
          </div>
        )}
        {items.map((item, index) => {
          const position = isShowOverview ? index + 1 : index;

          return (
            <div
              key={`item-${position}`}
              ref={accordionActions.handleRef(position)}>
              <InspectionAreaItem
                accordionSection={{
                  isOpen: accordionState.openIndex === position,
                  onClose: () => accordionActions.close(position),
                  onNext: () => accordionActions.next(position),
                  onOpen: () => accordionActions.open(position),
                }}
                hasNextItem={index < items.length - 1}
                isIngoingReport={props.isIngoingReport}
                isReportTenant={props.isReportTenant}
                isTestMode={props.isTestMode}
                item={item}
                role={props.role}
                onDelete={props.onDelete}
                onManagerCheckItem={props.onManagerCheckItem}
                onTenantAgreeItem={props.onTenantAgreeItem}
                onUpdate={props.onUpdateAreaItem}
                onUpdateAreaItemName={props.onUpdateAreaItemName}
                onUpdateBondClaim={props.onUpdateBondClaim}
                onUpdateNeedsWork={props.onUpdateNeedsWork}
                onUploaderComplete={props.onUploaderComplete}
                resetAreaItemCondition={resetAreaItemCondition}
              />
            </div>
          );
        })}
        {props.onCreateItem && (
          <Row>
            {isCreatingItem ? (
              <Col md={3}>
                <div className="p-3">
                  <InspectionFormAreaCreate
                    hasError={false}
                    isLoading={false}
                    onCancel={actions.handleClose}
                    onSubmit={actions.handleSubmit}
                  />
                </div>
              </Col>
            ) : (
              <Col xs={12}>
                <ButtonIcon
                  className="p-3"
                  data-testid="button-add-area-item"
                  icon={['far', 'plus-circle']}
                  onClick={actions.handleOpen}>
                  Add an item
                </ButtonIcon>
              </Col>
            )}
          </Row>
        )}
      </CardBody>
    </CardLight>
  );
};

InspectionArea.propTypes = {
  area: PropTypes.object,
  isIngoingReport: PropTypes.bool,
  isReportTenant: PropTypes.bool,
  isShowOverview: PropTypes.bool,
  isTestMode: PropTypes.bool,
  items: PropTypes.array,
  role: PropTypes.string,
  onCreateItem: PropTypes.func,
  onDelete: PropTypes.func,
  onManagerCheckItem: PropTypes.func,
  onTenantAgreeItem: PropTypes.func,
  onUpdateArea: PropTypes.func,
  onUpdateAreaItem: PropTypes.func,
  onUpdateAreaItemName: PropTypes.func,
  onUpdateBondClaim: PropTypes.func,
  onUpdateNeedsWork: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  resetAreaItemCondition: PropTypes.func,
  resetOverviewCondition: PropTypes.func,
};

InspectionArea.defaultProps = {
  items: [],
};

const InspectionAreaTableHeader = (props) => (
  <CardHeader className="d-none d-md-block">
    <Row className="no-gutters font-weight-bold">
      <Col md={3}>
        <span>Items</span>
      </Col>
      <Col md={2}>
        <Row className="no-gutters">
          <Col md={4}>Cln</Col>
          <Col md={4}>Udg</Col>
          <Col md={4}>Wkg</Col>
        </Row>
      </Col>
      <Col md={7} className="text-right">
        <span>{props.canAgree ? 'Agree?' : 'Actions'}</span>
      </Col>
    </Row>
  </CardHeader>
);

InspectionAreaTableHeader.propTypes = {
  canAgree: PropTypes.bool,
};
