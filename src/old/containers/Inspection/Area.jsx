import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

import { useIsOpen, useSortByPosition } from '../../hooks';
import { useAttachmentsFeaturedImg } from '../../modules/Attachments';
import { ButtonSort } from '../../modules/Button';
import { ContentSortableList } from '../../modules/Content';
import {
  InspectionArea as InspectionAreaModule,
  InspectionHeader,
  InspectionReportBlockedAlert,
} from '../../modules/Inspection';
import { ModalConfirm } from '../../modules/Modal';
import {
  createAreaItem,
  deleteAreaItem,
  fetchInspectionArea,
  getInspectionArea,
  getInspectionAreaItems,
  updateArea,
  updateAreaItem,
  updateInspectionAttachments,
} from '../../redux/inspection';
import { getProfile, getRole } from '../../redux/profile';
import {
  inspectionAreaAttachableTypeByRole,
  inspectionItemAttachableTypeByRole,
  pathnameBack,
  removeAttachments,
} from '../../utils';

const InspectionAreaComponent = (props) => {
  const {
    area,
    createAreaItem,
    deleteAreaItem,
    items,
    permissions,
    reportId,
    role,
    updateArea,
    updateAreaItem,
    updateInspectionAttachments,
    userId,
  } = props;
  const showAllItems =
    permissions.type.isLiveCondition || !!permissions.action.canCheckReportItem; // Show items even when they haven't been checked off by a manager

  const location = useLocation();
  const featuredImg = useAttachmentsFeaturedImg(
    area.manager?.attachments,
    'large'
  );
  const sortedItems = useSortByPosition(items);
  const [isSortingItems, buttonActions] = useIsOpen();

  const showOverview = useMemo(
    // Show the "Overall" area item if managers have checked it
    () => showAllItems || area.manager?.isChecked,
    [area.manager, showAllItems]
  );

  const filteredItems = useMemo(
    () =>
      showAllItems
        ? sortedItems
        : sortedItems.filter((item) => item.manager?.isChecked),
    [showAllItems, sortedItems]
  );

  const handleTenantAgreeItem = useCallback(
    (key, id) => (isAgreed) => {
      if (key === 'areaId') {
        updateArea({ areaId: id, reportId, role, isAgreed });
      } else if (key === 'areaItemId') {
        updateAreaItem({ areaItemId: id, reportId, role, isAgreed });
      }
    },
    [reportId, role, updateArea, updateAreaItem]
  );

  const handleManagerCheckItem = useCallback(
    (key, id) => (isChecked) => {
      if (key === 'areaId') {
        updateArea({ areaId: id, reportId, role, isChecked });
      } else if (key === 'areaItemId') {
        updateAreaItem({ areaItemId: id, reportId, role, isChecked });
      }
    },
    [reportId, role, updateArea, updateAreaItem]
  );

  const handleCreateItem = useCallback(
    (values) => createAreaItem({ ...values, reportId, areaId: area.id }),
    [area.id, createAreaItem, reportId]
  );

  const handleDeleteItem = useCallback(
    (item) => () => deleteAreaItem({ reportId, areaItemId: item.id }),
    [deleteAreaItem, reportId]
  );

  const handleUpdateArea = useCallback(
    (areaId) => (values) =>
      updateArea({ ...values, areaId, reportId, role, userId }),
    [reportId, role, updateArea, userId]
  );

  const handleUpdateAreaItem = useCallback(
    (areaItemId) => (values) =>
      updateAreaItem({ ...values, areaItemId, reportId, role, userId }),
    [reportId, role, updateAreaItem, userId]
  );

  const handleUpdatePosition = useCallback(
    ({ id, ...values }) =>
      updateAreaItem({
        ...values,
        areaId: area.id,
        areaItemId: id,
        reportId,
        role,
        userId,
      }),
    [area.id, reportId, role, updateAreaItem, userId]
  );

  const handleUploaderComplete = useCallback(
    (storeKey, storeId) => (values) =>
      updateInspectionAttachments({ ...values, role, storeId, storeKey }),
    [role, updateInspectionAttachments]
  );

  const resetAreaItemCondition = useCallback(
    (item) => {
      const itemRole = item[role] || {};
      const {
        id: itemId,
        isClean,
        isUndamaged,
        isWorking,
        note,
        manager,
      } = item;

      if (itemRole.attachments?.length) {
        const attachableId = itemRole.attachableId || itemId;
        const params = {
          attachableId,
          attachableType: inspectionItemAttachableTypeByRole(role),
          attachmentIds: itemRole.attachments.map(({ id }) => id),
        };

        removeAttachments(params, handleUploaderComplete('items', itemId));
      }

      if (
        !isClean ||
        !isUndamaged ||
        !isWorking ||
        note ||
        manager?.note ||
        manager?.isChecked
      ) {
        handleUpdateAreaItem(itemId)({
          isClean: true,
          isUndamaged: true,
          isWorking: true,
          isChecked: false,
          note: '',
        });
      }
    },
    [handleUpdateAreaItem, handleUploaderComplete, role]
  );

  const resetOverviewCondition = useCallback(() => {
    const areaRole = role === 'manager' ? area.manager : area.tenant;

    if (areaRole.attachments?.length) {
      const attachableId = areaRole.attachableId
        ? areaRole.attachableId
        : area.id;
      const params = {
        attachableId,
        attachableType: inspectionAreaAttachableTypeByRole(role),
        attachmentIds: areaRole.attachments.map(({ id }) => id),
      };

      removeAttachments(params, handleUploaderComplete('areas', area.id));
    }

    if (areaRole.note || areaRole.isChecked) {
      updateArea({
        areaId: area.id,
        reportId,
        role,
        isChecked: false,
        note: '',
        userId: areaRole.id,
      });
    }
  }, [
    area.id,
    area.manager,
    area.tenant,
    handleUploaderComplete,
    reportId,
    role,
    updateArea,
  ]);

  const resetAreaCondition = useCallback(() => {
    resetOverviewCondition();
    items.forEach((item) => resetAreaItemCondition(item));
  }, [items, resetAreaItemCondition, resetOverviewCondition]);

  const [isOpen, actions] = useIsOpen(resetAreaCondition);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (props.areaId) {
      buttonActions.handleClose();
      props.fetchInspectionArea({ reportId, areaId: props.areaId });
    }
  }, [props.areaId, reportId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <InspectionHeader
        backText={props.backText}
        backgroundImage={featuredImg}
        name={area.name}
        pathname={location.pathname}
        onUpdateArea={
          permissions.action.canEditArea ? handleUpdateArea(area.id) : null
        }
      />
      <Container className="py-4" data-testid="inspection-area">
        {permissions.action.canViewUpdateBlockedAlert &&
          props.updateBlockedByReportId && (
            <InspectionReportBlockedAlert
              path={pathnameBack(location.pathname)}
              updateBlockedByReportId={props.updateBlockedByReportId}
            />
          )}
        {permissions.action.canEditAreaItem && (
          <div className="d-flex flex-row justify-content-between">
            <ButtonSort
              className="my-3"
              data-testid="button-sort"
              onClick={buttonActions.handleToggle}>
              {isSortingItems ? 'Stop Sorting' : 'Sort Items'}
            </ButtonSort>
            <Button
              color="primary"
              className="h-75 text-nowrap"
              onClick={actions.handleOpen}>
              Reset condition
            </Button>
            <ModalConfirm
              body="Are you sure you want to reset this area? (Attachments will be permanently deleted)."
              btnSubmit={{ color: 'danger', text: 'Yes' }}
              isOpen={isOpen}
              title="Are you sure?"
              onCancel={actions.handleClose}
              onSubmit={actions.handleSubmit}
            />
          </div>
        )}
        {isSortingItems ? (
          <ContentSortableList
            items={filteredItems}
            onUpdate={handleUpdatePosition}
          />
        ) : (
          <InspectionAreaModule
            area={area}
            isIngoingReport={permissions.type.isIngoing}
            isReportTenant={props.isReportTenant}
            isShowOverview={showOverview}
            isTestMode={props.isTestMode}
            items={filteredItems}
            role={role}
            onCreateItem={
              permissions.action.canEditAreaItem ? handleCreateItem : null
            }
            onDelete={
              permissions.action.canEditAreaItem ? handleDeleteItem : null
            }
            onManagerCheckItem={
              permissions.action.canCheckReportItem
                ? handleManagerCheckItem
                : null
            }
            onTenantAgreeItem={
              permissions.action.canAgreeReportItem
                ? handleTenantAgreeItem
                : null
            }
            onUpdateArea={
              permissions.action.canCommentOnArea ? handleUpdateArea : null
            }
            onUpdateAreaItem={
              permissions.action.canCommentOnArea ? handleUpdateAreaItem : null
            }
            onUpdateAreaItemName={
              permissions.action.canEditAreaItem ? handleUpdateAreaItem : null
            }
            onUpdateBondClaim={
              permissions.action.canMarkPotentialBondClaim
                ? handleUpdateAreaItem
                : null
            }
            onUpdateNeedsWork={
              permissions.action.canMarkNeedsWork ? handleUpdateAreaItem : null
            }
            onUploaderComplete={
              permissions.action.canCommentOnArea
                ? handleUploaderComplete
                : null
            }
            resetAreaItemCondition={resetAreaItemCondition}
            resetOverviewCondition={resetOverviewCondition}
          />
        )}
      </Container>
    </>
  );
};

InspectionAreaComponent.propTypes = {
  area: PropTypes.object,
  areaId: PropTypes.number.isRequired,
  backText: PropTypes.string,
  createAreaItem: PropTypes.func,
  deleteAreaItem: PropTypes.func,
  fetchInspectionArea: PropTypes.func,
  isReportTenant: PropTypes.bool,
  isTestMode: PropTypes.bool, // set to true to disable certain form validations
  items: PropTypes.array,
  permissions: PropTypes.shape({
    action: PropTypes.object,
    status: PropTypes.object,
    type: PropTypes.object,
  }),
  reportId: PropTypes.number,
  role: PropTypes.string,
  updateArea: PropTypes.func,
  updateAreaItem: PropTypes.func,
  updateBlockedByReportId: PropTypes.number,
  updateInspectionAttachments: PropTypes.func,
  userId: PropTypes.number,
};

InspectionAreaComponent.defaultProps = {
  area: {},
  isReportTenant: false,
  items: [],
};

const mapStateToProps = (state, props) => {
  const { areaId } = props;

  const area = getInspectionArea(state.inspection, areaId);
  const items = getInspectionAreaItems(state.inspection, areaId);

  return {
    area,
    areaId,
    items,
    role: getRole(state.profile),
    userId: getProfile(state.profile).id,
  };
};

const mapDispatchToProps = {
  createAreaItem,
  deleteAreaItem,
  fetchInspectionArea,
  updateArea,
  updateAreaItem,
  updateInspectionAttachments,
};

export const InspectionArea = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionAreaComponent);
