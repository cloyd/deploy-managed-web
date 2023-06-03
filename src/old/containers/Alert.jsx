import animateScrollTo from 'animated-scroll-to';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert as AlertDefault, Container } from 'reactstrap';

import { usePrevious } from '../hooks';
import { hideAlert, resetIsRedirect } from '../redux/notifier';
import { sanitizeHtml } from '../utils';

const AlertComponent = (props) => {
  const {
    containerClassName,
    hideAlert,
    id,
    isOpen,
    isRedirect,
    isScroll,
    locationPathname,
    message,
    resetIsRedirect,
    isManualDismiss,
    ...rest
  } = props;

  const [innerHTML, setInnerHTML] = useState();
  const prevId = usePrevious(id);
  const prevPath = usePrevious(locationPathname);

  useEffect(() => {
    if (isOpen && isScroll && id !== prevId) {
      animateScrollTo(document.body);
    }
  }, [isOpen, id, prevId, isScroll]);

  useEffect(() => {
    setInnerHTML({ __html: sanitizeHtml(message) });
  }, [message]);

  useEffect(() => {
    if (isRedirect) {
      resetIsRedirect();
    }
  }, [isRedirect, resetIsRedirect]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Hide Alert if user moves to a new page - except they have been redirected to the page
    if (
      isOpen &&
      !isRedirect &&
      prevPath !== locationPathname &&
      (!prevPath || !prevPath.includes('/edit'))
    ) {
      hideAlert();
    }
  }, [isOpen, locationPathname, prevPath]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const onDismiss = () => {
    hideAlert();
  };

  return (
    <AlertDefault
      data-testid="alert"
      isOpen={isOpen}
      toggle={isManualDismiss ? onDismiss : null}
      {...rest}>
      <Container className={containerClassName}>
        <span dangerouslySetInnerHTML={innerHTML} />
      </Container>
    </AlertDefault>
  );
};

AlertComponent.propTypes = {
  containerClassName: PropTypes.string,
  hideAlert: PropTypes.func.isRequired,
  id: PropTypes.number,
  isOpen: PropTypes.bool,
  isRedirect: PropTypes.bool,
  isScroll: PropTypes.bool,
  locationPathname: PropTypes.string,
  message: PropTypes.string,
  resetIsRedirect: PropTypes.func.isRequired,
  isManualDismiss: PropTypes.bool,
};

AlertComponent.defaultProps = {
  message: '',
  isOpen: false,
  isRedirect: false,
  isScroll: true,
  isManualDismiss: false,
};

const mapStateToProps = ({ notifier }) => {
  return {
    color: notifier.color,
    id: notifier.id,
    isOpen: notifier.isAlert,
    isRedirect: notifier.isRedirect,
    isScroll: notifier.isScroll,
    message: notifier.message,
    locationPathname: window.location.pathname,
  };
};

const mapDispatchToProps = {
  hideAlert,
  resetIsRedirect,
};

export const Alert = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertComponent);
