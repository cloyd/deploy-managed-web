import PropTypes from 'prop-types';
import React from 'react';

const getLiClassName = (step, i) => {
  const styles = [
    'border',
    'border-primary',
    'rounded-circle',
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'ml-1',
  ];

  step === i
    ? styles.push('bg-primary', 'text-white')
    : styles.push('bg-white', 'text-primary');

  return styles.join(' ');
};

export const WelcomeStepIndicator = ({ step }) => {
  return (
    <ul className="list-inline d-flex flex-row m-0">
      {[1, 2].map((i) => (
        <li
          key={i}
          className={getLiClassName(step, i)}
          style={{ width: '30px', height: '30px' }}>
          {i}
        </li>
      ))}
    </ul>
  );
};

WelcomeStepIndicator.propTypes = {
  step: PropTypes.number.isRequired,
};
