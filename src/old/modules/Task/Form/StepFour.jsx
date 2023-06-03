import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Button } from 'reactstrap';

import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';
import { UploaderWidget } from '@app/modules/Uploader';
import { ATTACHMENT_CATEGORIES } from '@app/utils';

export const TaskFormStepFour = ({
  isRequired,
  onCancel,
  onChange,
  onSubmit,
  taskId,
  values,
}) => {
  const { attachments } = useMemo(() => {
    return values;
  }, [values]);

  const isDisabled = useMemo(() => {
    return isRequired && !attachments?.length;
  }, [attachments, isRequired]);

  const onUploaderComplete = useCallback(
    (response) => {
      onChange('attachments', response.attachments);
    },
    [onChange]
  );

  return (
    <StepsCard>
      <StepsCardBody
        className="mb-3 mb-lg-5"
        title="Please upload photos or videos">
        <UploaderWidget
          attachableType="PropertyTask"
          attachableId={taskId}
          attachments={attachments}
          attachableCategory={ATTACHMENT_CATEGORIES.taskAttachment}
          onUploaderComplete={onUploaderComplete}
        />
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 mr-3"
          color="primary"
          size="lg"
          onClick={onCancel}
          outline>
          Back
        </Button>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onClick={onSubmit}>
          Next
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepFour.propTypes = {
  isRequired: PropTypes.bool,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  taskId: PropTypes.number,
  values: PropTypes.object,
};
