import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import React from 'react';
import { Badge, CardImg } from 'reactstrap';

import { useImgSrcWithFallback } from '../../../hooks';
import { ContentProgressBar } from '../../Content';
import { Dropdown } from '../../Dropdown';
import { Link } from '../../Link';
import { useInspectionProgress } from '../hooks';

export const InspectionAreaListItem = (props) => {
  const { area, isIngoingReport, path, permissionsStatus, isArchived } = props;
  const { itemsCount, manager } = area;
  const areaImg =
    manager?.attachments?.length > 0 ? manager.attachments[0].urls.medium : '';

  const { handleError, imgSrc } = useImgSrcWithFallback(areaImg);

  const progressValue = useInspectionProgress({
    isPendingAgency: permissionsStatus?.isPendingAgency,
    isPendingTenant: permissionsStatus?.isPendingTenant,
    itemsCount,
  });

  return area.id ? (
    <div className="d-block" data-testid="inspection-area-list-item">
      <Link
        to={`${path}/area/${area.id}`}
        className="d-flex position-relative justify-content-center align-items-start"
        disabled={isArchived}>
        <CardImg
          top
          src={imgSrc || ''}
          onError={handleError}
          className="bg-light brand-default shadow-sm rounded"
        />
        {permissionsStatus?.isPendingAgency && !isIngoingReport && (
          <div
            className="position-absolute text-left"
            style={{ width: '90%', bottom: '10px' }}>
            <Badge
              color={progressValue === 100 ? 'success' : 'primary'}
              data-testid="badge-checked">
              {itemsCount?.overallChecked}{' '}
              {pluralize('items', itemsCount?.overallChecked)} checked
            </Badge>
          </div>
        )}
        {(permissionsStatus?.isPendingTenant ||
          (permissionsStatus?.isPendingAgency && isIngoingReport)) && (
          <ContentProgressBar
            value={progressValue}
            wrapperClassName="position-absolute shadow-sm"
            wrapperStyle={{ width: '90%', bottom: '10px' }}
          />
        )}
      </Link>
      <div className="d-flex text-left mt-2 mb-0">
        <div className="d-block w-100 text-dark">
          <strong className="d-block" data-testid="inspection-area-name">
            {area.name}
          </strong>
          <span>
            {props.isLiveCondition ||
            permissionsStatus?.isDraft ||
            permissionsStatus?.isPendingAgency
              ? itemsCount?.total + 1 // "Overall" item is not included in total
              : itemsCount?.overallChecked}{' '}
            items
          </span>
        </div>
        {props.onDelete && (
          <div
            data-testid="area-list-item-actions"
            style={{ visibility: isArchived ? 'hidden' : 'visible' }}>
            <Dropdown
              items={[
                {
                  title: 'Delete area',
                  onClick: () =>
                    props.onDelete({ id: area.id, name: area.name }),
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    area.id
  );
};

InspectionAreaListItem.propTypes = {
  area: PropTypes.object.isRequired,
  isIngoingReport: PropTypes.bool,
  isLiveCondition: PropTypes.bool,
  onDelete: PropTypes.func,
  path: PropTypes.string,
  permissionsStatus: PropTypes.shape({
    isDraft: PropTypes.bool,
    isPendingAgency: PropTypes.bool,
    isPendingTenant: PropTypes.bool,
  }),
  isArchived: PropTypes.bool,
};

InspectionAreaListItem.defaultProps = {
  path: '',
};
