import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { singular } from 'pluralize';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import {
  Col,
  Container,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';

import { useDebounce } from '@app/hooks';
import {
  formatUserTypeParam,
  useContactRole,
} from '@app/modules/Contacts/hooks';
import { Header } from '@app/modules/Header';
import { Link } from '@app/modules/Link';
import { Pagination } from '@app/modules/Pagination';
import { useRolesContext } from '@app/modules/Profile';
import { UserList, useUsers } from '@app/modules/User';
import { selectProfileData } from '@app/redux/profile';
import { getEndpointType } from '@app/redux/users';
import { toQueryObject } from '@app/utils';

/**
 * Contacts list for the following user types
 * - Manager
 * - Owner
 * - Tenant
 */
export const ContactsList = ({ navigation, history, location, match }) => {
  const { params } = match;

  const type = formatUserTypeParam(params.type);

  const loggedInUser = useSelector(selectProfileData);

  const searchParams = useMemo(
    () => toQueryObject(location.search),
    [location.search]
  );

  const [searchTerm, setSearchTerm] = useState(searchParams.search || '');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [includeInactiveManagers, setIncludeInactiveManagers] = useState(false);

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

  const { isCorporateUser, isManager } = useRolesContext();
  const contactRole = useContactRole(type);

  const isOwnersOrTenantsOrManagers =
    contactRole.isOwner || contactRole.isTenant || contactRole.isManager;
  const canCreate =
    isCorporateUser || contactRole.isCreditor || contactRole.isManager;
  const hasKyc = !(isManager && contactRole.isManager) && !contactRole.isTenant;

  const section = useMemo(
    () => navigation.find((nav) => nav.type === type) || {},
    [navigation, type]
  );

  const title = section.title || 'External Creditors';

  const titleLong = section.titleLong || title;

  const handleSearch = useCallback((e) => {
    const search = e.target.value;
    setSearchTerm(search);
  }, []);

  const handleToggleInactiveManagers = useCallback(() => {
    setIncludeInactiveManagers((active) => !active);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', debouncedSearchTerm);
    history.replace(`${location.pathname}?${searchParams.toString()}`);
  }, [debouncedSearchTerm, history, location.pathname, location.search]);

  const userListDefaultProps = useMemo(
    () => ({
      key: `Contacts.${title}`,
      loggedInUser: loggedInUser,
      matchUrl: match.url,
      titleLong,
      type,
      users,
      isIncludeInactiveManagers: includeInactiveManagers,
      isFiltered: debouncedSearchTerm !== '',
      hasKyc,
      hasStatus: isOwnersOrTenantsOrManagers,
    }),
    [
      debouncedSearchTerm,
      includeInactiveManagers,
      loggedInUser,
      match.url,
      title,
      titleLong,
      type,
      users,
      hasKyc,
      isOwnersOrTenantsOrManagers,
    ]
  );

  return (
    <div>
      <Header title={titleLong} isLoading={canCreate && isLoading}>
        {canCreate && (
          <Link
            color="primary"
            className="text-capitalize"
            to={`${match.url}/create`}>
            Add {singular(title)}
          </Link>
        )}
      </Header>

      <Container>
        <Row className="mb-3 justify-content-end">
          {isManager && isOwnersOrTenantsOrManagers && (
            <>
              {contactRole.isManager && (
                <Col
                  xs={{
                    size: isCorporateUser ? 6 : 12,
                    order: 2,
                  }}
                  md={{
                    size: 3,
                    order: 0,
                  }}
                  lg={3}
                  className="mb-2 align-self-center ">
                  <CustomInput
                    data-testid="filter-inactive-managers"
                    id="filter-inactive-managers"
                    type="checkbox"
                    label="Show Inactive"
                    onChange={handleToggleInactiveManagers}
                    checked={includeInactiveManagers}
                    className="custom-control-sm d-flex justify-content-md-end"
                  />
                </Col>
              )}
              <Col xs={isCorporateUser ? 6 : 12} md={6} lg={4} className="mb-2">
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
            </>
          )}
        </Row>
        {isLoading ? (
          <div className="d-flex justify-content-center py-3">
            <PulseLoader size={12} color="#dee2e6" />
          </div>
        ) : (
          <>
            <UserList {...userListDefaultProps} />
            <Pagination name={getEndpointType(type)} />
          </>
        )}
      </Container>
    </div>
  );
};

ContactsList.propTypes = {
  navigation: PropTypes.array,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

ContactsList.defaultProps = {
  navigation: [],
};
