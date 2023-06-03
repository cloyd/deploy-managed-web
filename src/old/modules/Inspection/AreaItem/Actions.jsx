import PropTypes from 'prop-types';
import React from 'react';

import {
  InspectionAreaItemComment,
  InspectionAreaItemManagerActions,
  InspectionAreaItemTenantActions,
  InspectionAreaItemToggle,
  useInspectionShowComment,
} from '..';
import { inspectionItemAttachableTypeByRole } from '../../../utils';

export const InspectionAreaItemActions = (props) => {
  const { isManager, isReportTenant, item, onUploaderComplete } = props;

  const { showManager, showTenant } = useInspectionShowComment(
    item.manager,
    item.tenant
  );
  const isCompactView = showManager || showTenant;

  return (
    <div className={props.className}>
      <div className="d-block w-100 mr-md-2">
        {showManager && (
          <InspectionAreaItemComment
            attachableId={item.id}
            attachableType={inspectionItemAttachableTypeByRole('manager')}
            role="manager"
            user={item.manager}
            onDestroyComplete={
              isManager && onUploaderComplete
                ? onUploaderComplete('items', item.id)
                : null
            }
          />
        )}
        {showTenant && (
          <InspectionAreaItemComment
            attachableId={item.id}
            attachableType={inspectionItemAttachableTypeByRole('tenant')}
            role="tenant"
            user={item.tenant}
            onDestroyComplete={
              isReportTenant && onUploaderComplete
                ? onUploaderComplete('items', item.id)
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
                isActive={item.manager?.isChecked}
                isCompactView={isCompactView}
                onClick={props.onManagerCheckItem}
                onUploaderComplete={onUploaderComplete}
              />
            )}
            {props.onTenantAgreeItem && (
              <InspectionAreaItemTenantActions
                isActive={item.tenant?.isAgreed}
                isCompactView={isCompactView}
                onClick={props.onTenantAgreeItem}
                onUploaderComplete={onUploaderComplete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

InspectionAreaItemActions.propTypes = {
  className: PropTypes.string,
  isHideActions: PropTypes.bool,
  isManager: PropTypes.bool,
  isReportTenant: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.number,
    manager: PropTypes.object,
    tenant: PropTypes.object,
  }),
  onManagerCheckItem: PropTypes.func,
  onTenantAgreeItem: PropTypes.func,
  onToggle: PropTypes.func,
  onUploaderComplete: PropTypes.func,
};

InspectionAreaItemActions.defaultProps = {
  className: 'd-md-flex mt-2 mt-md-0',
  isHideActions: false,
  isManager: false,
  isReportTenant: false,
  item: {},
};
