import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

import { InspectionAreaOverviewActions, InspectionFormAreaOverview } from '..';
import { toClassName } from '../../../utils';

export const InspectionAreaOverview = (props) => {
  const {
    accordionSection,
    area,
    hasNextItem,
    onManagerCheckItem,
    onUpdate,
    resetOverviewCondition,
  } = props;

  const handleSubmit = useCallback(
    (values) => {
      if (hasNextItem) {
        accordionSection.onNext();
      } else {
        accordionSection.onClose();
      }

      onUpdate && onUpdate(area.id)(values);
    },
    [accordionSection, area.id, hasNextItem, onUpdate]
  );

  return (
    <Container
      className={toClassName(
        ['border-bottom', 'py-3'],
        accordionSection.isOpen ? 'alert-secondary text-dark' : ''
      )}
      data-testid="inspection-area-overview">
      <Row>
        <Col md={3}>
          <strong className="pb-2">Overall</strong>
        </Col>
        <Col md={2} />
        <Col md={7}>
          <InspectionAreaOverviewActions
            area={area}
            isHideActions={accordionSection.isOpen}
            isReportTenant={props.isReportTenant}
            onManagerCheckItem={
              onManagerCheckItem ? onManagerCheckItem('areaId', area.id) : null
            }
            onToggle={onUpdate ? accordionSection.onOpen : null}
            onUploaderComplete={props.onUploaderComplete}
          />
        </Col>
        {accordionSection.isOpen && (
          <Col md={{ size: 9, offset: 3 }}>
            <Card color="light" className="border p-3">
              <InspectionFormAreaOverview
                area={area}
                btnSubmit={{ text: hasNextItem ? 'Save & Next Item' : 'Save' }}
                canEditIsChecked={!!onManagerCheckItem}
                hasError={false}
                isLoading={false}
                role={props.role}
                onCancel={onUpdate ? accordionSection.onClose : null}
                onSubmit={handleSubmit}
                onUploaderComplete={props.onUploaderComplete}
                resetOverviewCondition={resetOverviewCondition}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

InspectionAreaOverview.propTypes = {
  accordionSection: PropTypes.shape({
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
  }),
  area: PropTypes.object,
  hasNextItem: PropTypes.bool,
  isManager: PropTypes.bool,
  isReportTenant: PropTypes.bool,
  role: PropTypes.string,
  onManagerCheckItem: PropTypes.func,
  onUpdate: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  resetOverviewCondition: PropTypes.func,
};

InspectionAreaOverview.defaultProps = {
  accordionSection: { isOpen: false },
  area: {},
  hasNextItem: false,
};
