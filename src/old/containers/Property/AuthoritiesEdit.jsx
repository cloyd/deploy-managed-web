import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { FormPropertyAuthorities } from '../../modules/Form';
import { Header } from '../../modules/Header';
import { hasError } from '../../redux/notifier';
import {
  updateProperty,
  updatePropertyAttachments,
} from '../../redux/property';

const PropertyAuthoritiesEditComponent = (props) => {
  const {
    hasError,
    isLoading,
    property,
    updateProperty,
    updatePropertyAttachments,
  } = props;

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const handleCancel = useCallback(() => {
    const { property, history } = props;
    history.push(
      property && property.id ? `/property/${property.id}` : '/property'
    );
  }, [props]);

  const handleModalOpen = useCallback(() => {
    setIsConfirmationOpen(!isConfirmationOpen);
  }, [setIsConfirmationOpen, isConfirmationOpen]);

  return (
    <div className="wrapper">
      <Header title="Edit property fees & authorities" />
      <Container>
        <FormPropertyAuthorities
          hasError={hasError}
          isLoading={isLoading}
          property={property}
          onSubmit={updateProperty}
          onCancel={handleCancel}
          onUploaderComplete={updatePropertyAttachments}
          handleModalOpen={handleModalOpen}
          isConfirmationOpen={isConfirmationOpen}
        />
      </Container>
    </div>
  );
};

PropertyAuthoritiesEditComponent.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  property: PropTypes.object,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyAttachments: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    hasError: hasError(state),
    isLoading: state.property.isLoading,
  };
};

const mapDispatchToProps = {
  updateProperty,
  updatePropertyAttachments,
};

export const PropertyAuthoritiesEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyAuthoritiesEditComponent);
