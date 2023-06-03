import PropTypes from 'prop-types';
import React from 'react';

import {
  InspectionAreaItemComment,
  InspectionAreaItemManagerActions,
  InspectionAreaItemToggle,
  useInspectionShowComment,
} from '..';
import { USER_TYPES } from '../../../redux/users';
import { inspectionAreaAttachableTypeByRole } from '../../../utils';
import { useRolesContext } from '../../Profile';

export const InspectionAreaOverviewActions = (props) => {
  const { area, isReportTenant, onUploaderComplete } = props;
  const { manager, tenant } = area;

  const { isManager } = useRolesContext();
  const { showManager, showTenant } = useInspectionShowComment(manager, tenant);
  const isCompactView = showManager || showTenant;

  return (
    <div className={props.className}>
      <div className="d-block w-100 mr-md-2">
        {showManager && (
          <InspectionAreaItemComment
            attachableId={area.id}
            attachableType={inspectionAreaAttachableTypeByRole(
              USER_TYPES.manager
            )}
            role={USER_TYPES.manager}
            user={manager}
            onDestroyComplete={
              isManager && onUploaderComplete
                ? onUploaderComplete('areas', area.id)
                : null
            }
          />
        )}
        {showTenant && (
          <InspectionAreaItemComment
            attachableId={area.id}
            attachableType={inspectionAreaAttachableTypeByRole(
              USER_TYPES.tenant
            )}
            role={USER_TYPES.tenant}
            user={tenant}
            onDestroyComplete={
              isReportTenant && onUploaderComplete
                ? onUploaderComplete('areas', area.id)
                : null
            }
          />
        )}
      </div>
      {!props.isHideActions && (
        <div className="d-flex flex-column">
          <div className="d-flex align-items-start justify-content-end">
            {props.onToggle && (
              <InspectionAreaItemToggle
                isCompactView={isCompactView}
                onClick={props.onToggle}
              />
            )}
            {props.onManagerCheckItem && (
              <InspectionAreaItemManagerActions
                isActive={manager?.isChecked}
                isCompactView={isCompactView}
                onClick={props.onManagerCheckItem}
                onUploaderComplete={onUploaderComplete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

InspectionAreaOverviewActions.propTypes = {
  area: PropTypes.shape({
    id: PropTypes.number,
    manager: PropTypes.object,
    tenant: PropTypes.object,
  }),
  className: PropTypes.string,
  isHideActions: PropTypes.bool,
  isReportTenant: PropTypes.bool,
  onManagerCheckItem: PropTypes.func,
  onToggle: PropTypes.func,
  onUploaderComplete: PropTypes.func,
};

InspectionAreaOverviewActions.defaultProps = {
  className: 'd-md-flex mt-2 mt-md-0',
  isHideActions: false,
  isReportTenant: false,
  area: {},
};
