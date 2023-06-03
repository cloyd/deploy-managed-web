import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import {
  AttachmentsList,
  AttachmentsToggle,
  useAttachmentsFeaturedImg,
} from '.';
import { useIsOpen } from '../../hooks';
import { ModalConfirm } from '../Modal';

export const AttachmentsModule = (props) => {
  const { attachments } = props;
  const [isOpen, actions] = useIsOpen();
  const featuredImg = useAttachmentsFeaturedImg(attachments, 'thumb');

  return (
    <div className={props.className}>
      <AttachmentsToggle
        imgSrc={featuredImg}
        count={attachments.length}
        onClick={actions.handleOpen}
      />
      <ModalConfirm isOpen={isOpen} size="lg" title={props.title}>
        <AttachmentsList
          className="mb-3"
          attachableId={props.attachableId}
          attachableType={props.attachableType}
          attachments={attachments}
          role={props.role}
          onDestroyComplete={props.onDestroyComplete}
        />
        <Button outline color="primary" onClick={actions.handleClose}>
          Close
        </Button>
      </ModalConfirm>
    </div>
  );
};

AttachmentsModule.propTypes = {
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  attachments: PropTypes.array,
  className: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  role: PropTypes.string,
  title: PropTypes.string,
};

AttachmentsModule.defaultProps = {
  attachments: [],
  title: 'Attachments',
};
