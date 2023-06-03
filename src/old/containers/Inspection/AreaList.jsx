import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useIsOpen, useSortByPosition } from '../../hooks';
import { ButtonSort } from '../../modules/Button';
import { ContentSortableList } from '../../modules/Content';
import { InspectionAreaList as InspectionAreaListModule } from '../../modules/Inspection';
import { ModalConfirm } from '../../modules/Modal';
import {
  createArea,
  deleteArea,
  getInspectionAreasById,
  updateArea,
} from '../../redux/inspection';

const InspectionAreaListComponent = (props) => {
  const {
    areas,
    createArea,
    deleteArea,
    hasActions,
    propertyConditionId,
    reportId,
    updateArea,
    isArchived,
  } = props;

  const [areaToDelete, setAreaToDelete] = useState(null);
  const [isSortingItems, buttonActions] = useIsOpen();
  const sortedAreas = useSortByPosition(areas);
  const location = useLocation();

  const handleCreateArea = useCallback(
    (values) => {
      if (propertyConditionId) {
        createArea({ ...values, propertyConditionId, reportId });
      }
    },
    [createArea, propertyConditionId, reportId]
  );

  const handleCancelDeleteArea = useCallback(
    () => setAreaToDelete(null),
    [setAreaToDelete]
  );

  const handleDeleteArea = useCallback(() => {
    handleCancelDeleteArea();

    if (areaToDelete) {
      deleteArea({
        areaId: areaToDelete.id,
        propertyConditionId,
        reportId,
      });
    }
  }, [
    areaToDelete,
    deleteArea,
    handleCancelDeleteArea,
    propertyConditionId,
    reportId,
  ]);

  const handleUpdatePosition = useCallback(
    ({ id, ...values }) =>
      updateArea({
        ...values,
        areaId: id,
        ...(propertyConditionId && { propertyConditionId }),
        ...(reportId && { reportId }),
      }),
    [propertyConditionId, reportId, updateArea]
  );

  return hasActions ? (
    <>
      <ButtonSort
        className="mt-3"
        data-testid="button-sort"
        onClick={buttonActions.handleToggle}
        disabled={isArchived}>
        {isSortingItems ? 'Stop Sorting' : 'Sort Areas'}
      </ButtonSort>
      {isSortingItems ? (
        <ContentSortableList
          className="mt-3"
          items={sortedAreas}
          onUpdate={handleUpdatePosition}
        />
      ) : (
        <>
          <InspectionAreaListModule
            areas={sortedAreas}
            isIngoingReport={props.isIngoingReport}
            isLiveCondition={props.isLiveCondition}
            path={location.pathname}
            permissionsStatus={props.permissionsStatus}
            onDelete={setAreaToDelete}
            onSubmit={handleCreateArea}
            isArchived={isArchived}
          />
          <ModalConfirm
            data-testid="modal-delete-area"
            isOpen={!!areaToDelete}
            size="md"
            btnCancel={{ text: 'Cancel' }}
            btnSubmit={{ text: 'Delete', color: 'danger' }}
            onCancel={handleCancelDeleteArea}
            onSubmit={handleDeleteArea}>
            {areaToDelete && (
              <p>
                Are you sure you would like to remove{' '}
                <strong>{areaToDelete.name || 'this area'}</strong> from the
                property condition?
              </p>
            )}
          </ModalConfirm>
        </>
      )}
    </>
  ) : (
    <InspectionAreaListModule
      areas={sortedAreas}
      isIngoingReport={props.isIngoingReport}
      isLiveCondition={props.isLiveCondition}
      path={location.pathname}
      permissionsStatus={props.permissionsStatus}
    />
  );
};

InspectionAreaListComponent.propTypes = {
  areas: PropTypes.array,
  condition: PropTypes.object,
  createArea: PropTypes.func,
  deleteArea: PropTypes.func,
  hasActions: PropTypes.bool,
  isIngoingReport: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLiveCondition: PropTypes.bool,
  permissionsStatus: PropTypes.shape({
    isPendingAgency: PropTypes.bool,
    isPendingTenant: PropTypes.bool,
  }),
  propertyConditionId: PropTypes.number,
  report: PropTypes.object,
  reportId: PropTypes.number,
  updateArea: PropTypes.func,
  isArchived: PropTypes.bool,
};

const mapStateToProps = (state, props) => {
  const { condition, report } = props;

  const propertyConditionId = report?.propertyConditionId
    ? report.propertyConditionId
    : condition?.id
    ? condition.id
    : null;

  return {
    areas: getInspectionAreasById(
      state.inspection,
      report?.areas || condition?.areas
    ),
    isLoading: state.inspection.isLoading,
    propertyConditionId,
    reportId: report?.id,
  };
};

const mapDispatchToProps = {
  createArea,
  deleteArea,
  updateArea,
};

export const InspectionAreaList = connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionAreaListComponent);
