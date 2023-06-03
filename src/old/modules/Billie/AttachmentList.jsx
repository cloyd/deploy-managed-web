import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Card } from 'reactstrap';

import { BillieAttachment } from '.';
import { toClassName } from '../../utils';

export const BillieAttachmentList = ({
  attachableId,
  attachableType,
  attachments,
  onClick,
  onDestroyComplete,
  selected,
}) => {
  const handleClick = useCallback(
    (attachment) => () => onClick(attachment),
    [onClick]
  );

  return (
    <div className="d-flex">
      <Card
        style={{ minWidth: '80px', minHeight: '110px' }}
        className={toClassName(
          [
            'align-items-center',
            'border',
            'd-flex',
            'justify-content-center',
            'pointer',
          ],
          !selected.id ? 'border-primary text-primary' : 'border-400 text-400'
        )}
        onClick={handleClick()}>
        <FontAwesomeIcon className="fa-2x" icon={['far', 'cloud-upload']} />
      </Card>
      <div className="d-flex overflow-auto">
        {attachments.map((attachment) => (
          <BillieAttachment
            attachableId={attachableId}
            attachableType={attachableType}
            attachment={attachment}
            isSelected={selected === attachment}
            key={attachment.id}
            onClick={handleClick(attachment)}
            onDestroyComplete={onDestroyComplete}
          />
        ))}
      </div>
    </div>
  );
};

BillieAttachmentList.propTypes = {
  attachableId: PropTypes.number.isRequired,
  attachableType: PropTypes.string.isRequired,
  attachments: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onDestroyComplete: PropTypes.func.isRequired,
  selected: PropTypes.object,
};
