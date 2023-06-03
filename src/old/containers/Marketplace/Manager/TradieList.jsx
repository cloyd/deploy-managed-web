import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';

import { useLocationParams } from '@app/hooks';
import { ExternalCreditorList } from '@app/modules/ExternalCreditor';
import { Filter } from '@app/modules/Filter';
import { Header } from '@app/modules/Header';
import { Link } from '@app/modules/Link';
import { useMarketplaceTags } from '@app/modules/Marketplace';
import { Pagination } from '@app/modules/Pagination';
import {
  MARKETPLACE_FEE_OPTIONS,
  fetchTradies,
  getExternalCreditors,
  selectIsUsersLoading,
  selectManagersAgencies,
} from '@app/redux/users';

// TODO: create a marketplace module and reuse it on both contacts and marketplace pages/containers
export const MarketplaceTradieList = ({ isPreferred, customFilter }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useLocationParams();
  const { marketplaceTagFormOptions } = useMarketplaceTags();

  const isLoading = useSelector(selectIsUsersLoading);
  const tradies = useSelector((state) => getExternalCreditors(state.users));
  const managerAgencies = useSelector(selectManagersAgencies);

  const hiddenColumns = isPreferred ? ['Admin fee'] : [];

  const handleClear = useCallback(() => {
    history.replace(`${history.location.pathname}?page=1`);
  }, [history]);

  // NOTE: this changes will fix the duplicate fetch tradies call
  // TODO: create a way to simplify fetching tradies regardless of params
  // effect specifically for marketplace
  useEffect(() => {
    if (!isPreferred) {
      dispatch(fetchTradies(params));
    }
  }, [dispatch, isPreferred, params]);

  // effect specifically for contat => preferred tradies page
  useEffect(() => {
    const tradieParams = params;

    if (isPreferred && managerAgencies.length) {
      tradieParams['q[g][0][m]'] = 'and';
      tradieParams['q[g][0][agency_external_creditors_preferred_eq]'] = true;
      tradieParams['q[g][0][agency_external_creditors_agency_id_in]'] =
        managerAgencies.toString();

      if (tradieParams.search) {
        tradieParams.perPage = 10;
        tradieParams['q[g][0][any_name_email_phone_cont]'] =
          tradieParams.search;
        delete tradieParams.search;
      }

      dispatch(fetchTradies(tradieParams));
    }
  }, [dispatch, isPreferred, managerAgencies, params]);

  return (
    <Filter name="external-creditors" isSaved={true}>
      <Header
        className="mb-0"
        title={isPreferred ? 'Preferred Tradies' : 'Marketplace'}
        isLoading={isLoading}>
        <Link
          color="primary"
          to={
            isPreferred
              ? '/contacts/preferred-tradies/invite'
              : '/marketplace/invite'
          }>
          Invite a tradie
        </Link>
      </Header>
      <Container className="py-4" data-testid="marketplace-tradie-list">
        {customFilter ? (
          customFilter()
        ) : (
          <Row className="mb-3">
            <Col sm={6} lg={3} className="pb-2 pr-1">
              <Filter.TypeaheadSelect
                label="Tradie tag"
                name="tagId"
                values={marketplaceTagFormOptions}
              />
            </Col>
            <Col sm={6} lg={3} className="pb-2 pr-1">
              <Filter.TypeaheadSelect
                label="Admin fee"
                name="agencyPaysAdminFee"
                values={MARKETPLACE_FEE_OPTIONS}
              />
            </Col>
            <Col lg={3} className="pb-2 pr-1">
              <Filter.Search label="Search" name="search" />
            </Col>
            <Col
              xs={6}
              lg={{ size: 1, offset: 1 }}
              className="pt-2 px-1 text-center">
              <Filter.Clear onClick={handleClear} />
            </Col>
            <Col
              xs={6}
              lg={1}
              className="pl-3 pl-md-1 flex-lg-fill text-center pl-lg-2">
              <Filter.Submit className="mt-1 w-100" color="primary" size="md">
                Filter
              </Filter.Submit>
            </Col>
          </Row>
        )}

        {isLoading ? (
          <Col className="py-5 text-center">
            <PulseLoader color="#dee2e6" />
          </Col>
        ) : (
          <>
            <ExternalCreditorList
              tradies={tradies}
              hiddenColumns={hiddenColumns}
            />
            <Pagination name="external-creditors" isReload={false} />
          </>
        )}
      </Container>
    </Filter>
  );
};

MarketplaceTradieList.propTypes = {
  isPreferred: PropTypes.bool,
  customFilter: PropTypes.func,
};

MarketplaceTradieList.defaultProps = {
  isPreferred: false,
};

export default MarketplaceTradieList;
