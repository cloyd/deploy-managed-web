import PropTypes from 'prop-types';
import React from 'react';
import { CardImg, Col, Container, Row } from 'reactstrap';

import { AttachmentsIcon } from '.';
import { useImgSrcWithFallback } from '../../hooks';
import { UploaderDestroy } from '../Uploader';

/**
 * Shows thumbnails for a given list of attachments.
 * Requires attachableId, attachableType and onDestroyComplete for file deletion.
 *
 * @param {number} attachableId optional for file deletion - ID of object file is attached to
 * @param {string} attachableType optional for file deletion - model type of object file is attached to
 * @param {Object[]} attachments list of attachments
 * @param {number} lg width of each thumnail in Bootstrap lg breakpoint
 * @param {number} md width of each thumnail in Bootstrap md breakpoint
 * @param {function} onDestroyComplete optional callback after files have been deleted
 * @param {number} sm width of each thumnail in Bootstrap sm breakpoint
 */
export const AttachmentsList = ({
  className,
  attachments,
  sm,
  md,
  lg,
  attachableType,
  attachableId,
  onDestroyComplete,
  canShowFileName,
}) => (
  <Container className={className}>
    <Row>
      {attachments.length > 0 ? (
        attachments.map((attachment) => (
          <Col sm={sm} md={md} lg={lg} key={`attachment-${attachment.id}`}>
            <AttachmentsListItem
              className="mb-3"
              attachableType={attachableType}
              attachableId={attachableId}
              attachment={attachment}
              onDestroyComplete={onDestroyComplete}
              canShowFileName={canShowFileName}
            />
          </Col>
        ))
      ) : (
        <p>No attachments found</p>
      )}
    </Row>
  </Container>
);

AttachmentsList.propTypes = {
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  attachments: PropTypes.array,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  lg: PropTypes.number,
  md: PropTypes.number,
  onDestroyComplete: PropTypes.func,
  sm: PropTypes.number,
  canShowFileName: PropTypes.bool,
};

AttachmentsList.defaultProps = {
  attachments: [],
  lg: null,
  md: 4,
  sm: 6,
  canShowFileName: true,
};

const AttachmentsListItem = ({
  attachableId,
  attachableType,
  attachment,
  className,
  onDestroyComplete,
  canShowFileName,
}) => {
  const isImage = !!attachment.urls.medium;
  const showDelete = attachableId && attachableType && !!onDestroyComplete;

  const { handleError, imgSrc } = useImgSrcWithFallback(attachment.urls.medium);

  return (
    <div className={className}>
      <div className="position-relative">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={attachment.urls.original}>
          {!isImage && (
            <div
              className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ background: '#f8f5fe' }}>
              <AttachmentsIcon filename={attachment.filename} size="4x" />
            </div>
          )}
          <CardImg
            top
            src={imgSrc || ''}
            onError={handleError}
            className="bg-light brand-default shadow-sm rounded"
          />
        </a>
      </div>
      {(showDelete || canShowFileName) && (
        <div className="d-flex mt-2 mb-3 text-break">
          {showDelete && (
            <UploaderDestroy
              className="py-0"
              attachableId={attachableId}
              attachmentId={attachment.id}
              attachableType={attachableType}
              onComplete={onDestroyComplete}
            />
          )}
          {canShowFileName && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={attachment.urls.original}>
              {attachment.filename}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

AttachmentsListItem.propTypes = {
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  attachment: PropTypes.object.isRequired,
  className: PropTypes.string,
  onDestroyComplete: PropTypes.func,
  canShowFileName: PropTypes.bool,
};
