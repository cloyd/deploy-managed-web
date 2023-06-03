import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container } from 'reactstrap';

import { useOnce } from '../../hooks';
import { Filter, FilterReport } from '../../modules/Filter';
import { useDateFilter } from '../../modules/Filter/hooks';
import { Header } from '../../modules/Header';
import { OwnerFinancialsCreditSplit } from '../../modules/Owner';
import { useRolesContext } from '../../modules/Profile';
import {
  PropertyExpensesTable,
  PropertyFinancialsCard,
  PropertyFinancialsSummary,
  PropertyIncomeTable,
} from '../../modules/Property';
import {
  fetchPropertyFinancials,
  getOwnerIds,
  getPropertiesFromIds,
  getPropertyFinancials,
  getPropertyOwnershipsFromIds,
} from '../../redux/property';
import { fetchOwners, getOwnersFromIds } from '../../redux/users';
import { formatDate, toQueryObject } from '../../utils';

const PropertyFinancialsComponent = (props) => {
  const {
    fetchOwners,
    fetchPropertyFinancials,
    location,
    ownerCreditSplits,
    ownerIds,
    owners,
    property,
    properties,
  } = props;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { isManager } = useRolesContext();

  const params = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const { startsAt, endsAt } = useDateFilter(params);

  const company = useMemo(
    () =>
      property.company && property.company.discardedAt === null
        ? property.company
        : null,
    [property.company]
  );

  const downloadLinks = useMemo(() => {
    const query = `?paid_at_gteq=${formatDate(
      params.startsAt,
      'dateLocal'
    )}&paid_at_lteq=${formatDate(params.endsAt, 'dateLocal')}`;

    const fileName = `${property.address.street}_financials_${params.startsAt}-${params.endsAt}`;

    return {
      csv: {
        url: `/api/properties/${property.id}/financials.csv${query}`,
        filename: `${fileName}.csv`,
      },
      pdf: {
        url: `/api/properties/${property.id}/financials.pdf${query}`,
        filename: `${fileName}.pdf`,
      },
    };
  }, [params.endsAt, params.startsAt, property.address.street, property.id]);

  const handleClear = useCallback(() => setHasSubmitted(false), []);

  const handleSubmit = useCallback(() => {
    fetchPropertyFinancials({
      startsAt: params.startsAt,
      endsAt: params.endsAt,
      propertyId: property.id,
      format: 'json',
    });
    setHasSubmitted(true);
  }, [params, fetchPropertyFinancials, property.id]);

  useOnce(() => {
    if (isManager && ownerIds.length > 0) {
      fetchOwners({ ownerIds });
    }
  });

  return (
    <Filter name="financials" isSaved={true} isUpdateUrlOnChange={true}>
      <Header
        color="none"
        canDownload={hasSubmitted}
        downloadLinks={downloadLinks}
        isLoading={props.isLoading}
        title="Property Financials"
      />
      <Formik>
        <Container>
          <FilterReport
            endsAt={endsAt}
            isLoading={props.isLoading}
            location={location}
            startsAt={startsAt}
            onSubmit={handleSubmit}
            onClear={handleClear}
          />
          {props.isLoading && (
            <Col className="py-5 text-center">
              <PulseLoader color="#dee2e6" />
            </Col>
          )}
          {hasSubmitted && props.financials && (
            <>
              <PropertyFinancialsCard
                company={company}
                financials={props.financials}
                secondaryOwners={property.secondaryOwners}
              />
              <PropertyIncomeTable
                propertyId={property.id}
                financials={props.financials}
              />
              <PropertyExpensesTable
                propertyId={property.id}
                financials={props.financials}
              />
              <PropertyFinancialsSummary financials={props.financials} />
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

PropertyFinancialsComponent.propTypes = {
  fetchOwners: PropTypes.func,
  fetchPropertyFinancials: PropTypes.func,
  financials: PropTypes.object,
  isLoading: PropTypes.bool,
  lease: PropTypes.object,
  location: PropTypes.object,
  ownerCreditSplits: PropTypes.object,
  ownerIds: PropTypes.array,
  owners: PropTypes.object,
  properties: PropTypes.object,
  property: PropTypes.object,
};

const mapStateToProps = (state, props) => {
  const ownerIds = getOwnerIds(state.property, [props.property.id]);

  return {
    financials: getPropertyFinancials(state.property, props.property.id),
    isLoading: state.property.isLoading,
    ownerIds,
    ownerCreditSplits: getPropertyOwnershipsFromIds(state.property, [
      props.property.id,
    ]),
    owners: getOwnersFromIds(state.users, ownerIds),
    properties: getPropertiesFromIds(state.property, [props.property.id]),
  };
};

const mapDispatchToProps = {
  fetchPropertyFinancials,
  fetchOwners,
};

export const PropertyFinancials = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyFinancialsComponent);
