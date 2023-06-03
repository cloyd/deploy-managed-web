import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Card } from 'reactstrap';

import { BillieAttachmentImage } from '.';
import { toClassName } from '../../utils';
import { UploaderDestroy } from '../Uploader';

export const BillieAttachment = ({
  attachableId,
  attachableType,
  attachment,
  isSelected,
  onClick,
  onDestroyComplete,
}) => {
  return (
    <Card
      className={toClassName(
        ['border ml-2 position-relative'],
        isSelected ? 'border-primary' : 'border-400'
      )}
      style={{
        minWidth: '80px',
        minHeight: '110px',
        width: '80px',
        height: '110px',
      }}>
      {attachment.isAttached ? (
        <div
          className="fa-layers position-absolute"
          style={{ bottom: '6px', right: '6px', zIndex: 20 }}>
          <FontAwesomeIcon icon={['fas', 'circle']} className="text-white" />
          <FontAwesomeIcon
            icon={['fas', 'check-circle']}
            className="text-success"
          />
        </div>
      ) : (
        <UploaderDestroy
          attachableId={attachableId}
          attachableType={attachableType}
          attachmentId={attachment.id}
          className="d-flex align-items-center p-0 position-absolute btn btn-link btn-lg"
          onComplete={onDestroyComplete}
          style={{ top: '0', right: '-8px', zIndex: 20 }}
        />
      )}
      <BillieAttachmentImage onClick={onClick} attachment={attachment} />
    </Card>
  );
};

BillieAttachment.propTypes = {
  attachableId: PropTypes.number.isRequired,
  attachableType: PropTypes.string.isRequired,
  attachment: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onDestroyComplete: PropTypes.func.isRequired,
};

BillieAttachment.defaultProps = {
  isSelected: false,
};
