import PropTypes from 'prop-types';
import React from 'react';

import { ATTACHMENT_CATEGORIES } from '../../utils';
import { UploaderForm } from '../Uploader';

export const BilliePreview = ({
  attachableId,
  attachableType,
  attachment,
  onUploaderComplete,
}) => {
  return attachment && attachment.id ? (
    attachment.contentType === 'application/pdf' ? (
      <object type="application/pdf" data={attachment.urls.original}>
        <p>PDF cannot be displayed.</p>
      </object>
    ) : (
      <img src={attachment.urls.original} style={{ maxWidth: '100%' }} />
    )
  ) : (
    <UploaderForm
      attachableId={attachableId}
      attachableType={attachableType}
      attachableCategory={ATTACHMENT_CATEGORIES.agencyBill}
      dragDropStrings={{
        dropHereOr: 'First drag and drop PDF invoices here or %{browse}',
      }}
      onComplete={onUploaderComplete}
    />
  );
};

BilliePreview.propTypes = {
  attachableId: PropTypes.number,
  attachableType: PropTypes.string,
  attachment: PropTypes.object,
  onUploaderComplete: PropTypes.func.isRequired,
};
