import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Progress } from 'reactstrap';

export const StepsProgress = ({ step, total }) => {
  const value = useMemo(() => {
    return Math.round((step / total) * 100);
  }, [step, total]);

  return <Progress value={value} className="rounded-0" />;
};

StepsProgress.defaultProps = {
  step: 0,
  total: 0,
};

StepsProgress.propTypes = {
  step: PropTypes.number,
  total: PropTypes.number,
};
