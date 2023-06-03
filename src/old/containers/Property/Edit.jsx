import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import { FormProperty } from '../../modules/Form';
import { Header } from '../../modules/Header';
import {
  PropertyArchiveButton,
  PropertyUnarchiveButton,
} from '../../modules/Property';
import { hasError } from '../../redux/notifier';
import { getProfile } from '../../redux/profile';
import {
  archiveProperty,
  createProperty,
  unarchiveProperty,
  updateProperty,
  updatePropertyAttachments,
} from '../../redux/property';
import { getUser } from '../../redux/users';

class PropertyEditComponent extends Component {
  static propTypes = {
    createProperty: PropTypes.func.isRequired,
    archiveProperty: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    isArchived: PropTypes.bool,
    isCorporateUser: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    isManager: PropTypes.bool,
    location: PropTypes.object.isRequired,
    manager: PropTypes.object,
    newPropertyId: PropTypes.number,
    property: PropTypes.object,
    updateProperty: PropTypes.func.isRequired,
    updatePropertyAttachments: PropTypes.func.isRequired,
    unarchiveProperty: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isManager: false,
    property: {},
  };

  componentDidUpdate(prevProps) {
    const { history, isArchived, newPropertyId } = this.props;
    // Redirect after create.
    this.hasCreatedProperty(prevProps) &&
      history.push(`/property/${newPropertyId}/edit`);

    // Redirect after delete.
    this.hasDeletedProperty(prevProps) && history.push('/property');

    // Redirect after Archive.
    isArchived && history.push('/property');
  }

  hasCreatedProperty(prevProps) {
    const { newPropertyId } = this.props;
    return newPropertyId && newPropertyId !== prevProps.newPropertyId;
  }

  hasDeletedProperty(prevProps) {
    return (
      prevProps.property &&
      prevProps.property.id &&
      this.props.property &&
      !this.props.property.id
    );
  }

  handleCancel = () => {
    const { property, history } = this.props;
    history.push(
      property && property.id ? `/property/${property.id}` : '/property'
    );
  };

  handleArchive = (values) => {
    const { property } = this.props;
    this.props.archiveProperty({ ...values, id: property.id });
  };

  handleUnarchive = (values) => {
    const { property } = this.props;
    this.props.unarchiveProperty({ ...values, id: property.id });
  };

  render() {
    const {
      createProperty,
      hasError,
      isCorporateUser,
      isLoading,
      isManager,
      manager,
      property,
      updateProperty,
      updatePropertyAttachments,
    } = this.props;
    return (
      <div className="wrapper">
        <Header
          title={property.id ? 'Edit property details' : 'Add a property'}>
          {property.id &&
            !isCorporateUser &&
            (!property.archivedAt ? (
              <PropertyArchiveButton
                className="text-small"
                onConfirm={this.handleArchive}>
                Archive property
              </PropertyArchiveButton>
            ) : (
              <PropertyUnarchiveButton
                className="text-small"
                onConfirm={this.handleUnarchive}>
                Unarchive property
              </PropertyUnarchiveButton>
            ))}
        </Header>
        <Container>
          <FormProperty
            agency={property.agency}
            hasError={hasError}
            isLoading={isLoading}
            isManager={isManager}
            manager={manager}
            managers={property.managers}
            property={property}
            onSubmit={property.id ? updateProperty : createProperty}
            onCancel={this.handleCancel}
            onUploaderComplete={updatePropertyAttachments}
          />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { match, property } = props;
  const isCreate = /create/.test(match.path);

  return {
    manager: getUser(state.users, getProfile(state.profile)),
    newPropertyId: isCreate ? state.property.result : undefined,
    hasError: hasError(state),
    isArchived: isCreate
      ? false
      : property.isArchived || property.archivedAt !== null,
    isLoading: state.property.isLoading,
  };
};

const mapDispatchToProps = {
  createProperty,
  archiveProperty,
  updateProperty,
  updatePropertyAttachments,
  unarchiveProperty,
};

export const PropertyEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyEditComponent);
