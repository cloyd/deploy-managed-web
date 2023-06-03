import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { ButtonIcon } from '../modules/Button';
import { Filter, FilterReport } from '../modules/Filter';
import { useDateFilter } from '../modules/Filter/hooks';
import { Header } from '../modules/Header';
import {
  OwnerExpensesTable,
  OwnerFinancialsCreditSplit,
  OwnerFinancialsSummary,
  OwnerIncomeTable,
} from '../modules/Owner';
import { useRolesContext } from '../modules/Profile';
import { isOwner as getIsOwner, getProfile } from '../redux/profile';
import {
  getOwnerIds,
  getPropertiesFromIds,
  getPropertyOwnershipsFromIds,
} from '../redux/property';
import {
  emailOwnerFinancials,
  fetchOwnerFinancials,
  fetchOwners,
  getOwnerFinancials,
  getOwnersFromIds,
} from '../redux/users';
import { formatDate, toQueryObject } from '../utils';

const OwnerFinancialsComponent = (props) => {
  const {
    emailOwnerFinancials,
    fetchOwnerFinancials,
    fetchOwners,
    ownerCreditSplits,
    ownerId,
    ownerIds,
    owners,
    properties,
  } = props;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { isManager } = useRolesContext();

  const params = useMemo(
    () => toQueryObject(props.location.search),
    [props.location.search]
  );

  const downloadLinks = useMemo(() => {
    const query = `?paid_at_gteq=${formatDate(
      params.startsAt,
      'dateLocal'
    )}&paid_at_lteq=${formatDate(params.endsAt, 'dateLocal')}`;

    return {
      csv: {
        url: `/api/owners/${ownerId}/financials.csv${query}`,
        filename: 'financials.csv',
      },
      pdf: {
        url: `/api/owners/${ownerId}/financials.pdf${query}`,
        filename: 'financials.pdf',
      },
    };
  }, [ownerId, params.endsAt, params.startsAt]);

  const { startsAt, endsAt } = useDateFilter(params);

  const handleOnClick = useCallback(() => {
    window.location.assign(`/contacts/owners/${ownerId}`);
  }, [ownerId]);

  const handleSubmit = useCallback(() => {
    const { startsAt, endsAt } = params;

    if (startsAt && endsAt) {
      fetchOwnerFinancials({ startsAt, endsAt, ownerId, format: 'json' });
      setHasSubmitted(true);
    }
  }, [params, fetchOwnerFinancials, ownerId]);

  const handleClear = useCallback(() => setHasSubmitted(false), []);

  const handleEmailRequest = useCallback(() => {
    const { startsAt, endsAt } = params;

    if (startsAt && endsAt) {
      emailOwnerFinancials({ startsAt, endsAt, ownerId });
    }
  }, [emailOwnerFinancials, ownerId, params]);

  const canSendEmail = useMemo(() => {
    const maxIntentions = 100;
    const maxProperties = 10;

    return (
      !props.isLoading &&
      hasSubmitted &&
      (props.financials.numberOfTransactions > maxIntentions ||
        props.financials.numberOfProperties > maxProperties)
    );
  }, [props, hasSubmitted]);

  useEffect(() => {
    if (isManager && ownerIds.length > 0) {
      fetchOwners({ ownerIds });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isManager, ownerIds.length]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Filter name="financials" isSaved={true} isUpdateUrlOnChange={true}>
      {isManager && (
        <Container>
          <ButtonIcon
            className="p-0 mt-3"
            icon={['far', 'chevron-left']}
            onClick={handleOnClick}>
            Back to owner details
          </ButtonIcon>
        </Container>
      )}
      <Header
        color="none"
        canDownload={hasSubmitted}
        canSendEmail={canSendEmail}
        downloadLinks={downloadLinks}
        isLoading={props.isLoading}
        title="Financials"
        onEmailRequest={handleEmailRequest}
      />
      <Formik>
        <Container>
          <FilterReport
            endsAt={endsAt}
            isLoading={props.isLoading}
            location={props.location}
            onSubmit={handleSubmit}
            startsAt={startsAt}
            onClear={handleClear}
          />
          {props.isLoading && (
            <Col className="py-5 text-center">
              <PulseLoader color="#dee2e6" />
            </Col>
          )}
          {hasSubmitted && props.financials && (
            <>
              <OwnerIncomeTable financials={props.financials} />
              <OwnerExpensesTable financials={props.financials} />
              <OwnerFinancialsSummary financials={props.financials} />
              <OwnerFinancialsCreditSplit
                properties={properties}
                owners={owners}
                ownerCreditSplits={ownerCreditSplits}
              />
            </>
          )}
        </Container>
      </Formik>
    </Filter>
  );
};

OwnerFinancialsComponent.propTypes = {
  emailOwnerFinancials: PropTypes.func,
  fetchOwnerFinancials: PropTypes.func.isRequired,
  fetchOwners: PropTypes.func,
  financials: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  ownerId: PropTypes.number.isRequired,
  ownerCreditSplits: PropTypes.object,
  owners: PropTypes.object,
  properties: PropTypes.object,
  ownerIds: PropTypes.array,
};

const mapStateToProps = (state, props) => {
  const isOwner = getIsOwner(state.profile);
  const ownerId = isOwner
    ? getProfile(state.profile).id
    : parseInt(props.match.params.id);

  const financials = getOwnerFinancials(state.users, ownerId);
  const { propertyIds } = financials || {};

  const properties = getPropertiesFromIds(state.property, propertyIds);
  const ownerIds = getOwnerIds(state.property, propertyIds);

  return {
    financials,
    isLoading: state.profile.isLoading,
    isOwner,
    ownerCreditSplits: getPropertyOwnershipsFromIds(
      state.property,
      propertyIds
    ),
    ownerId,
    ownerIds,
    owners: getOwnersFromIds(state.users, ownerIds),
    properties,
  };
};

const mapDispatchToProps = {
  fetchOwnerFinancials,
  fetchOwners,
  emailOwnerFinancials,
};

export const OwnerFinancials = connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnerFinancialsComponent);
