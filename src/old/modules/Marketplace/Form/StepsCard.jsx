import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';

import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';

export const MarketplaceFormStepsCard = ({
  btnText,
  children,
  icon,
  isDisabled,
  onSubmit,
  title,
}) => {
  return (
    <StepsCard>
      <StepsCardBody className="mb-4 mb-lg-5" icon={icon} title={title}>
        {children}
      </StepsCardBody>
      <StepsCardFooter>
        <Button
          className="px-5"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onClick={onSubmit}>
          {btnText || 'Next'}
        </Button>
      </StepsCardFooter>
    </StepsCard>
  );
};

MarketplaceFormStepsCard.propTypes = {
  btnText: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.array,
  isDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
