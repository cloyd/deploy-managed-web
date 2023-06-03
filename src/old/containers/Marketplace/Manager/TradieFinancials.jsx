import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { ButtonIcon } from '../../../modules/Button';
import { FinancialsCard, FinancialsTable } from '../../../modules/Contacts';
import { Filter, FilterReport } from '../../../modules/Filter';
import { useDateFilter } from '../../../modules/Filter/hooks';
import { Header } from '../../../modules/Header';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  fetchExternalCreditor,
  fetchExternalCreditorFinancials,
  getExternalCreditor,
  getExternalCreditorFinancials,
} from '../../../redux/users';
import { toQueryObject } from '../../../utils';

/**
 * Financials page for non-global External Creditors
 * Used when Managed Marketplace is disabled for an agency
 */
const ContainerComponent = (props) => {
  const {
    fetchExternalCreditorFinancials,
    financials,
    history,
    tradieId,
    user,
  } = props;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const params = useMemo(
    () => toQueryObject(props.location.search),
    [props.location.search]
  );

  const { startsAt, endsAt } = useDateFilter(params);

  const handleBack = useCallback(
    () => history.push(`/marketplace/tradie/${tradieId}`),
    [history, tradieId]
  );

  const handleSubmit = useCallback(() => {
    const { startsAt, endsAt } = params;

    if (startsAt && endsAt) {
      fetchExternalCreditorFinancials({
        startsAt,
        endsAt,
        id: tradieId,
      });

      setHasSubmitted(true);
    }
  }, [fetchExternalCreditorFinancials, params, tradieId]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (
      user.id &&
      user.classification !== EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie
    ) {
      history.push(`/marketplace/tradie/${user.id}`);
    }
  }, [user.id]);

  useEffect(() => {
    if (tradieId) {
      props.fetchExternalCreditor({ id: tradieId });
    }
  }, [tradieId]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Filter name="financials" isSaved={true} isUpdateUrlOnChange={true}>
      <Container>
        <ButtonIcon
          className="p-0 mt-3"
          icon={['far', 'chevron-left']}
          onClick={handleBack}>
          Back to tradie details
        </ButtonIcon>
      </Container>
      <Header color="none" title="Tradie Financials" canPrint />
      <Formik>
        <Container>
          <FilterReport
            endsAt={endsAt}
            isLoading={props.isLoading}
            location={props.location}
            onSubmit={handleSubmit}
            startsAt={startsAt}
          />
          {props.isLoading && (
            <Col className="py-5 text-center">
              <PulseLoader color="#dee2e6" />
            </Col>
          )}
          {hasSubmitted && financials && (
            <>
              <FinancialsCard creditor={financials.externalCreditor} />
              <FinancialsTable financials={financials.taskIntentions} />
            </>
          )}
        </Container>
      </Formik>
    </Filter>
  );
};

ContainerComponent.propTypes = {
  fetchExternalCreditor: PropTypes.func,
  fetchExternalCreditorFinancials: PropTypes.func,
  financials: PropTypes.object,
  history: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object,
  match: PropTypes.object.isRequired,
  tradieId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  user: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const { tradieId } = props.match.params;

  return {
    tradieId,
    financials: getExternalCreditorFinancials(state.users, tradieId),
    isLoading: state.users.isLoading,
    user: getExternalCreditor(state.users, tradieId),
  };
};

const mapDispatchToProps = {
  fetchExternalCreditor,
  fetchExternalCreditorFinancials,
};

export const MarketplaceTradieFinancials = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerComponent);
