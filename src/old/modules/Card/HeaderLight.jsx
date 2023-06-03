import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { CardHeader, CardTitle } from 'reactstrap';

export const CardHeaderLight = ({ children, isLoading, hasCustomLoader }) => (
  <CardHeader className="d-flex justify-content-between bg-white border-400 flex-grow-3">
    <CardTitle className="mb-0 w-100" tag="h5">
      {children}
    </CardTitle>
    {!hasCustomLoader && isLoading && (
      <div className="d-flex  justify-content-end" style={{ minWidth: '60px' }}>
        <PulseLoader size={10} color="#dee2e6" loading={isLoading} />
      </div>
    )}
  </CardHeader>
);

CardHeaderLight.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool,
  hasCustomLoader: PropTypes.bool,
};

CardHeaderLight.defaultProps = {
  isLoading: false,
  hasCustomLoader: false,
};
