import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

import { InspectionAreaUpdateName, InspectionFormAreaItem } from '..';
import { toClassName } from '../../../utils';
import { useRolesContext } from '../../Profile';
import { InspectionAreaItemActions } from './Actions';
import { InspectionAreaItemBondClaim } from './BondClaim';
import { InspectionAreaItemDestroy } from './Destroy';
import { InspectionAreaItemNeedsWork } from './NeedsWork';
import { InspectionAreaItemStatus } from './Status';

export const InspectionAreaItem = (props) => {
  const {
    accordionSection,
    hasNextItem,
    isIngoingReport,
    item,
    onManagerCheckItem,
    onTenantAgreeItem,
    onUpdate,
    onUpdateBondClaim,
    onUpdateNeedsWork,
    resetAreaItemCondition,
  } = props;

  const [hasError, setHasError] = useState(false); // When comment form has an error
  const [isDisagreeInvalid, setIsDisagreeInvalid] = useState(false); // When handleTenantAgreeItem is invalid
  const { isManager } = useRolesContext();

  const containerClassName = hasError
    ? 'alert-danger'
    : accordionSection.isOpen
    ? 'alert-secondary'
    : '';

  const handleSubmit = useCallback(
    (values) => {
      if (hasNextItem) {
        accordionSection.onNext();
      } else {
        accordionSection.onClose();
      }

      onUpdate && onUpdate(item.id)(values);
    },
    [accordionSection, hasNextItem, item.id, onUpdate]
  );

  const handleTenantAgreeItem = useCallback(
    (value) => {
      if (
        value === false &&
        (item.tenant?.attachments?.length === 0 || !item.tenant?.note)
      ) {
        // If the tenant has disagreed to an Area Item,
        // but has not added a note and an attachment
        setIsDisagreeInvalid(true);
        accordionSection.onOpen();
      } else {
        onTenantAgreeItem('areaItemId', item.id)(value);
      }
    },
    [accordionSection, item.id, item.tenant, onTenantAgreeItem]
  );

  useEffect(() => {
    if (!accordionSection.isOpen) {
      setHasError(false);
      setIsDisagreeInvalid(false);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [accordionSection.isOpen]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return item.id ? (
    <Container
      className={toClassName(
        ['border-bottom', 'py-3', 'text-dark'],
        containerClassName
      )}
      data-testid="inspection-area-item">
      <Row>
        <Col md={3} className="d-flex pr-md-1 mb-2 mb-md-0">
          <div className="d-block w-100">
            <InspectionAreaUpdateName
              name={item.name}
              onUpdateArea={
                props.onUpdateAreaItemName
                  ? props.onUpdateAreaItemName(item.id)
                  : null
              }>
              <p className="my-1">
                <strong>{item.name}</strong>
              </p>
            </InspectionAreaUpdateName>
            {!isIngoingReport && (
              <>
                {(onUpdateBondClaim || item?.isPotentialBondClaim) && (
                  <InspectionAreaItemBondClaim
                    isPotentialBondClaim={item?.isPotentialBondClaim}
                    itemId={item?.id}
                    onChange={onUpdateBondClaim}
                  />
                )}
                {(onUpdateNeedsWork || item?.isWorkNeeded) && (
                  <InspectionAreaItemNeedsWork
                    isWorkNeeded={item?.isWorkNeeded}
                    itemId={item?.id}
                    onChange={onUpdateNeedsWork}
                  />
                )}
              </>
            )}
          </div>
          {props.onDelete && (
            <div className="d-inline-block ml-2">
              <InspectionAreaItemDestroy
                item={item}
                onDelete={props.onDelete}
              />
            </div>
          )}
        </Col>
        <Col md={2} className="mb-2 mb-md-0">
          <InspectionAreaItemStatus item={item} />
        </Col>
        <Col md={7}>
          <InspectionAreaItemActions
            isHideActions={accordionSection.isOpen}
            isManager={isManager}
            isReportTenant={props.isReportTenant}
            item={item}
            onManagerCheckItem={
              onManagerCheckItem
                ? onManagerCheckItem('areaItemId', item.id)
                : null
            }
            onTenantAgreeItem={onTenantAgreeItem ? handleTenantAgreeItem : null}
            onToggle={onUpdate ? accordionSection.onOpen : null}
            onUploaderComplete={props.onUploaderComplete}
          />
        </Col>
        {accordionSection.isOpen && (
          <Col md={{ size: 9, offset: 3 }}>
            <Card color="light" className="border p-3">
              <InspectionFormAreaItem
                btnSubmit={{
                  text: hasNextItem ? 'Save & Next Item' : 'Save',
                }}
                canEditAreaItemStatus={isManager}
                canEditIsAgreed={!!onTenantAgreeItem}
                canEditIsChecked={!!onManagerCheckItem}
                hasError={hasError}
                isDisagreeInvalid={isDisagreeInvalid}
                isLoading={false}
                isTestMode={props.isTestMode}
                item={item}
                role={props.role}
                onCancel={onUpdate ? accordionSection.onClose : null}
                onSetHasError={setHasError}
                onSubmit={handleSubmit}
                onUpdate={onUpdate(item.id)}
                onUploaderComplete={props.onUploaderComplete}
                resetAreaItemCondition={resetAreaItemCondition}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  ) : null;
};

InspectionAreaItem.propTypes = {
  accordionSection: PropTypes.shape({
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
  }),
  hasNextItem: PropTypes.bool,
  isIngoingReport: PropTypes.bool,
  isLoading: PropTypes.bool,
  isReportTenant: PropTypes.bool,
  isTestMode: PropTypes.bool,
  item: PropTypes.object,
  role: PropTypes.string,
  onDelete: PropTypes.func,
  onManagerCheckItem: PropTypes.func,
  onTenantAgreeItem: PropTypes.func,
  onUpdate: PropTypes.func,
  onUpdateAreaItemName: PropTypes.func,
  onUpdateBondClaim: PropTypes.func,
  onUpdateNeedsWork: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  resetAreaItemCondition: PropTypes.func,
};

InspectionAreaItem.defaultProps = {
  accordionSection: { isOpen: false },
  hasNextItem: false,
  item: {},
};
