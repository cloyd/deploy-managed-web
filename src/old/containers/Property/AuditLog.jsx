import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { Button, Col, Container } from 'reactstrap';

import { Header } from '../../modules/Header';
import { Pagination } from '../../modules/Pagination';
import { PropertyAuditLogTable } from '../../modules/Property';
import {
  fetchPropertyFeeAudits,
  getPropertyFeeAudits,
} from '../../redux/property';
import { toQueryObject } from '../../utils';

const PropertyAuditLogComponent = (props) => {
  const { isLoading, property, fetchPropertyFeeAudits, audits, page } = props;

  useEffect(() => {
    if (property.id) {
      fetchPropertyFeeAudits({
        propertyId: property.id,
        page: page,
      });
    }
  }, [fetchPropertyFeeAudits, property.id, page]);
  const history = useHistory();

  const handleBack = useCallback(
    () => history.replace(`/property/${property.id}`),
    [property.id, history]
  );

  return (
    <div className="wrapper">
      <Header title="Audit Log">
        <Button className="p-0" color="link" onClick={handleBack}>
          Back to Property Overview
        </Button>
      </Header>
      <Container>
        {isLoading && (
          <Col className="py-5 text-center">
            <PulseLoader color="#dee2e6" />
          </Col>
        )}
        {audits.length > 0 ? (
          <PropertyAuditLogTable audits={audits} />
        ) : (
          'No audit logs found for this property'
        )}
        <Pagination className="mt-2" name="fees_audits" isReload={false} />
      </Container>
    </div>
  );
};

PropertyAuditLogComponent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  property: PropTypes.object,
  fetchPropertyFeeAudits: PropTypes.func.isRequired,
  audits: PropTypes.array,
  page: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const { property } = props;

  return {
    isLoading: state.property.isLoading,
    audits: getPropertyFeeAudits(state.property, property.id),
    page: toQueryObject(props.location.search).page || '1',
  };
};

const mapDispatchToProps = {
  fetchPropertyFeeAudits,
};

export const PropertyAuditLog = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyAuditLogComponent);
