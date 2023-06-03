import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';

export const TaskFormStepDone = ({ onSubmit, title }) => {
  return (
    <StepsCard>
      <StepsCardBody icon={['fal', 'check-circle']} title="Done!">
        <p className="mb-4">
          Your request is on its way to {title}. The team will review the
          request. You can track the status of the request or send us a message
          by visiting Taks tab within a property page.
        </p>
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5 ml-3"
          color="primary"
          size="lg"
          onClick={onSubmit}>
          Close
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

TaskFormStepDone.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.func,
};
