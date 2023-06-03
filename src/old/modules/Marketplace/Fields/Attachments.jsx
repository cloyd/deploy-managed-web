import PropTypes from 'prop-types';
import React from 'react';
import { Card, FormGroup } from 'reactstrap';

import { AttachmentsList } from '@app/modules/Attachments';
import { UploaderWidgetIdsField } from '@app/modules/Uploader';

export const MarketplaceFieldsAttachments = ({ attachments, onChange }) => {
  return (
    <Card className="bg-lavender text-left p-4 mb-3">
      <FormGroup className="m-0">
        {!!attachments?.length && (
          <AttachmentsList
            attachments={attachments}
            canShowFileName={false}
            md={3}
          />
        )}
        <UploaderWidgetIdsField
          onUploaderComplete={onChange('attachmentIds')}
        />
      </FormGroup>
    </Card>
  );
};

MarketplaceFieldsAttachments.propTypes = {
  attachments: PropTypes.array,
  onChange: PropTypes.func,
};
