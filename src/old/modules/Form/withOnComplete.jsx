import PropTypes from 'prop-types';
import React from 'react';

export const withOnComplete = (WrappedComponent) => {
  const displayName = (c) => c.displayName || c.name || 'Component';

  return class WithOnComplete extends React.Component {
    static propTypes = {
      canReset: PropTypes.bool,
      hasError: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      isSubmitting: PropTypes.bool.isRequired,
      resetForm: PropTypes.func.isRequired,
      setSubmitting: PropTypes.func.isRequired,
      onComplete: PropTypes.func,
      values: PropTypes.object.isRequired,
    };

    static displayName = `WithOnComplete(${displayName(WrappedComponent)})`;

    componentDidUpdate(prevProps) {
      const {
        canReset,
        hasError,
        isLoading,
        isSubmitting,
        onComplete,
        resetForm,
        setSubmitting,
        values,
      } = this.props;

      if (isSubmitting && !isLoading && prevProps.isLoading) {
        setSubmitting(false);
        !hasError && onComplete && onComplete(values);
        !hasError && canReset && resetForm();
      }
    }

    render() {
      const { hasError, isLoading, onComplete, ...props } = this.props;
      return <WrappedComponent {...props} />;
    }
  };
};
