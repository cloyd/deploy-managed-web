import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Modal } from 'reactstrap';

export const LoadingComponent = ({ isOpen }) => {
  const modalOnClosed = useCallback(() => {
    document.body.classList.remove('modal-open');
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      centered={true}
      onClosed={modalOnClosed}
      contentClassName="border-0 bg-transparent text-center">
      <h4 className="text-white mb-4">Processing</h4>
      <PulseLoader size={25} color="#dee2e6" />
      <span className="text-white mt-3">Please do not refresh the page</span>
    </Modal>
  );
};

LoadingComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state, props) => ({
  isOpen: state.notifier.isLoading || props.isLoading || false,
});

export const Loading = connect(mapStateToProps)(LoadingComponent);
