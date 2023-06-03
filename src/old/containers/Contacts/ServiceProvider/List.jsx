import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

import { useDebounce } from '@app/hooks';
import { UserList, useUsers } from '@app/modules/User';
import { selectProfileData } from '@app/redux/profile';
import { toQueryObject } from '@app/utils';

import { Filter } from '../../../modules/Filter';
import { Header } from '../../../modules/Header';
import { Pagination } from '../../../modules/Pagination';
import { USER_TYPES, getEndpointType } from '../../../redux/users';

/**
 * Service Provider list
 * Used when Managed Marketplace is enabled for an agency
 */
const ContainerComponent = ({ location, match }) => {
  const type = USER_TYPES.externalCreditor;
  const titleLong = 'Search Service Providers';

  const loggedInUser = useSelector(selectProfileData);

  const searchParams = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const {
    isLoading,
    data: users = [],
    isFetching,
  } = useUsers({
    type,
    params: {
      ...searchParams,
      search: debouncedSearchTerm,
    },
  });

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Filter name="contacts" isSaved={false}>
      <Header title="Service Providers" />
      {!isLoading ? (
        <Container>
          <Row className="mb-3 justify-content-end">
            <Col xs={12} md={6} lg={4} className="mb-2">
              <InputGroup>
                <Input
                  placeholder={`Search ${titleLong}`}
                  name="search"
                  onChange={handleSearch}
                  value={searchTerm}
                  disable={isLoading || isFetching}
                  type="search"
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText className="py-1">
                    <FontAwesomeIcon icon={['far', 'search']} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
          <UserList
            key="contacts-service-providers"
            hasKyc
            hasStatus={false}
            loggedInUser={loggedInUser}
            matchUrl={match.url}
            titleLong="Service Provider"
            type={USER_TYPES.externalCreditor}
            users={users}
            isFiltered={debouncedSearchTerm !== ''}
          />
          <Pagination name={getEndpointType(USER_TYPES.externalCreditor)} />
        </Container>
      ) : (
        <div className="d-flex justify-content-center py-3">
          <PulseLoader size={12} color="#dee2e6" />
        </div>
      )}
    </Filter>
  );
};

ContainerComponent.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  params: PropTypes.shape({
    page: PropTypes.string,
  }),
};

ContainerComponent.defaultProps = {
  params: {
    page: '1',
  },
};

export const ServiceProviderList = ContainerComponent;
