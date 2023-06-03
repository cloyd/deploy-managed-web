import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { Filter } from '@app/modules/Filter';
import { replaceSearchParams } from '@app/utils';

import { MarketplaceTradieList } from '../../Marketplace/Manager';

export const PreferredTradies = () => {
  const history = useHistory();

  const historyReplace = useCallback(
    (params) =>
      history.replace({
        search: replaceSearchParams({
          params,
          search: history.location.search,
        }),
      }),
    [history]
  );

  const handleFilterSearch = useCallback(
    (search) => {
      if (search.length === 0 || search.length > 2) {
        historyReplace({ search });
      }
    },
    [historyReplace]
  );

  const renderPreferredTradiesFilter = useCallback(
    () => (
      <Row className="mb-3 justify-content-end">
        <Col xs={12} md={6} lg={4} className="mb-2">
          <Filter.Search
            data-testid="contact-user-search"
            label="Search Preferred Tradies"
            name="search"
            onChange={handleFilterSearch}
          />
        </Col>
      </Row>
    ),
    [handleFilterSearch]
  );

  return (
    <MarketplaceTradieList
      isPreferred
      customFilter={renderPreferredTradiesFilter}
    />
  );
};

export default PreferredTradies;
