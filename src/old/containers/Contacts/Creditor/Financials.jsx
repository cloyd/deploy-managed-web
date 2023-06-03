import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { ButtonIcon } from '../../../modules/Button';
import { FinancialsCard, FinancialsTable } from '../../../modules/Contacts';
import { Filter, FilterReport } from '../../../modules/Filter';
import { useDateFilter } from '../../../modules/Filter/hooks';
import { Header } from '../../../modules/Header';
import {
  fetchExternalCreditorFinancials,
  getExternalCreditorFinancials,
} from '../../../redux/users';
import { toQueryObject } from '../../../utils';

/**
 * Financials page for non-global External Creditors
 * Used when Managed Marketplace is disabled for an agency
 */
const ContactsCreditorFinancialsComponent = (props) => {
  const { fetchExternalCreditorFinancials, financials, id } = props;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const params = useMemo(
    () => toQueryObject(props.location.search),
    [props.location.search]
  );

  const { startsAt, endsAt } = useDateFilter(params);

  const handleBack = useCallback(() => {
    window.location.assign(`/contacts/creditors/${id}`);
  }, [id]);

  const handleSubmit = useCallback(() => {
    const { startsAt, endsAt } = params;

    if (startsAt && endsAt) {
      fetchExternalCreditorFinancials({
        startsAt,
        endsAt,
        id,
      });

      setHasSubmitted(true);
    }
  }, [fetchExternalCreditorFinancials, id, params]);

  return (
    <Filter name="financials" isSaved={true} isUpdateUrlOnChange={true}>
      <Container>
        <ButtonIcon
          className="p-0 mt-3"
          icon={['far', 'chevron-left']}
          onClick={handleBack}>
          Back to creditor details
        </ButtonIcon>
      </Container>
      <Header color="none" title="Creditor Financials" canPrint />
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

ContactsCreditorFinancialsComponent.propTypes = {
  fetchExternalCreditorFinancials: PropTypes.func.isRequired,
  financials: PropTypes.object,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.object,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
  const { id } = props.match.params;

  return {
    id,
    financials: getExternalCreditorFinancials(state.users, id),
    isLoading: state.users.isLoading,
  };
};

const mapDispatchToProps = {
  fetchExternalCreditorFinancials,
};

export const ContactsCreditorFinancials = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsCreditorFinancialsComponent);
