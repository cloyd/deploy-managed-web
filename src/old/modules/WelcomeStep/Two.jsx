import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

export const WelcomeStepTwo = (props) => (
  <div data-testid="welcome-steps-two">
    <h1 className="h3 mb-4 ml-1 text-primary">2. {props.title}</h1>
    {props.children}
    <Button
      block
      className="mt-4"
      color="primary"
      data-testid="button-step-two-next"
      disabled={props.isDisabled}
      size="lg"
      onClick={props.onNext}>
      Next
    </Button>
  </div>
);

WelcomeStepTwo.propTypes = {
  children: PropTypes.node,
  isDisabled: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  title: PropTypes.string,
};
