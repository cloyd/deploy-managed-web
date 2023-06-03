import PropTypes from 'prop-types';
import React from 'react';

export const DashboardContext = React.createContext();

export const DashboardProvider = (props) => {
  const { handleClick, isClickable } = props;

  return (
    <DashboardContext.Provider
      value={{
        handleClick,
        isClickable,
      }}>
      {props.children}
    </DashboardContext.Provider>
  );
};

DashboardProvider.propTypes = {
  handleClick: PropTypes.func,
  isClickable: PropTypes.bool,
  children: PropTypes.node,
};
