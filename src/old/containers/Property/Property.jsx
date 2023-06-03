import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  PropertyAuditLog,
  PropertyAuthoritiesEdit,
  PropertyEdit,
  PropertyLease,
  PropertyLoans,
  PropertyOverview,
  PropertyReports,
  PropertySettings,
  PropertyTransactions,
  PropertyTransactionsReport,
} from '.';
import { NavSub } from '../../modules/Nav';
import { useRolesContext } from '../../modules/Profile';
import { Calculator, PropertyPage } from '../../modules/Property';
import { setTheme } from '../../modules/Theme';
import { fetchAgency, getAgency } from '../../redux/agency';
import {
  fetchLeases,
  getLeaseActive,
  getLeaseUpcoming,
  getLeasesExpiredByDaysAgo,
} from '../../redux/lease';
import { fetchProperty, getProperty } from '../../redux/property';
import { fetchOwner, fetchTenant } from '../../redux/users';
import { Inspection } from '../Inspection';
import { PropertyTask } from '../PropertyTask';

const PropertyComponent = (props) => {
  const {
    lease,
    leaseUpcoming,
    match,
    primaryOwner,
    property,
    propertyId,
    tenant,
    profile,
  } = props;

  const dispatch = useDispatch();

  const { isCorporateUser, isManager, isOwner, isTenant } = useRolesContext();

  const renderEdit = useCallback(
    (routeProps) => (
      <PropertyEdit
        isCorporateUser={isCorporateUser}
        isManager={isManager}
        property={property}
        {...routeProps}
      />
    ),
    [isCorporateUser, isManager, property]
  );

  const renderAuthoritiesEdit = useCallback(
    (routeProps) => (
      <PropertyAuthoritiesEdit
        isCorporateUser={isCorporateUser}
        property={property}
        {...routeProps}
      />
    ),
    [isCorporateUser, property]
  );

  const renderAuditLog = useCallback(
    (routeProps) => (
      <PropertyAuditLog
        isCorporateUser={isCorporateUser}
        isManager={isManager}
        property={property}
        {...routeProps}
      />
    ),
    [isCorporateUser, isManager, property]
  );

  const renderInspection = useCallback(
    (routeProps) => (
      <PropertyPage headerClassname={'mb-0'} {...props}>
        <Inspection property={property} {...routeProps} />
      </PropertyPage>
    ),
    [property, props]
  );

  const renderLease = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertyLease
          lease={lease}
          leaseUpcoming={leaseUpcoming}
          property={property}
          {...routeProps}
        />
      </PropertyPage>
    ),
    [lease, leaseUpcoming, property, props]
  );

  const renderLoans = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertyLoans property={property} lease={lease} {...routeProps} />
      </PropertyPage>
    ),
    [lease, property, props]
  );

  const renderOverview = useCallback(
    (routeProps) => (
      <PropertyPage hasImage {...props}>
        <PropertyOverview
          isManager={isManager}
          isOwner={isOwner}
          lease={lease && lease.id ? lease : leaseUpcoming}
          property={property}
          profile={profile}
          isTenant={isTenant}
          {...routeProps}
        />
      </PropertyPage>
    ),
    [
      isManager,
      isOwner,
      lease,
      leaseUpcoming,
      property,
      profile,
      isTenant,
      props,
    ]
  );

  const renderReports = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertyReports property={property} {...routeProps} />
      </PropertyPage>
    ),
    [property, props]
  );

  const renderSettings = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertySettings
          property={property}
          owner={primaryOwner}
          {...routeProps}
        />
      </PropertyPage>
    ),
    [primaryOwner, property, props]
  );

  const renderTasks = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertyTask property={property} tenant={tenant} {...routeProps} />
      </PropertyPage>
    ),
    [property, props, tenant]
  );

  const renderTransactions = useCallback(
    (routeProps) => (
      <PropertyPage {...props}>
        <PropertyTransactions property={property} {...routeProps} />
      </PropertyPage>
    ),
    [property, props]
  );

  const renderWalletReport = useCallback(
    (routeProps) => (
      <PropertyTransactionsReport property={property} {...routeProps} />
    ),
    [property]
  );

  const pages = useMemo(
    () => ({
      overview: {
        title: 'Overview',
        to: match.url,
        render: renderOverview,
        exact: true,
      },
      lease: {
        title: 'Lease',
        to: `${match.url}/lease`,
        render: renderLease,
        exact: true,
      },
      tasks: {
        title: 'Tasks',
        to: `${match.url}/tasks`,
        render: renderTasks,
        exact: false,
      },
      transactions: {
        title: 'Transactions',
        to: `${match.url}/transactions`,
        render: renderTransactions,
        exact: true,
      },
      loans: {
        title: 'Loans',
        to: `${match.url}/loans`,
        render: renderLoans,
        exact: false,
      },
      reports: {
        title: 'Reports',
        to: `${match.url}/reports`,
        render: renderReports,
        exact: true,
      },
      settings: {
        title: 'Settings',
        to: `${match.url}/settings`,
        render: renderSettings,
        exact: true,
      },
      edit: {
        title: 'Edit',
        to: `${match.url}/edit`,
        render: renderEdit,
        exact: true,
      },
      inspections: {
        title: 'Inspections',
        to: `${match.url}/inspections`,
        render: renderInspection,
        exact: false,
      },
      authoritiesEdit: {
        title: 'Authorities Edit',
        to: `${match.url}/authoritiesEdit`,
        render: renderAuthoritiesEdit,
        exact: true,
      },
      auditLog: {
        title: 'Audit Log',
        to: `${match.url}/auditLog`,
        render: renderAuditLog,
        exact: true,
      },
    }),
    [
      match.url,
      renderAuditLog,
      renderAuthoritiesEdit,
      renderEdit,
      renderInspection,
      renderLease,
      renderLoans,
      renderOverview,
      renderReports,
      renderSettings,
      renderTasks,
      renderTransactions,
    ]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  const filteredPages = useMemo(() => {
    // Require property to have been fetched
    if (!property.id) {
      return {
        navigation: [],
        routes: [],
      };
    }

    const pageKeys = [];
    if (isManager) {
      // Permissions for managers
      pageKeys.push(
        'overview',
        'lease',
        'tasks',
        'transactions',
        'edit',
        'authoritiesEdit',
        'auditLog'
      );
    } else if (isOwner) {
      // Permissions for owners
      pageKeys.push('overview', 'lease', 'tasks', 'transactions');

      if (property.canViewLoansTab) {
        pageKeys.push('loans');
      }
    } else if ((lease && lease.id) || (leaseUpcoming && leaseUpcoming.id)) {
      // Permissions for tenants of active leases
      pageKeys.push('overview', 'lease', 'tasks', 'transactions');
    } else {
      // Permissions for tenants of expired leases
      pageKeys.push('overview', 'tasks', 'transactions');
    }

    if (property && property.isInspectionModuleEnabled) {
      // If Inspection Module is enabled
      pageKeys.push('inspections');
    }

    if ((isManager || isOwner) && property) {
      // feature flag to hide report tab
      pageKeys.push('reports');
    }

    if (isOwner) {
      // owner payment and disbursement account settings
      pageKeys.push('settings');
    }

    // Remove Edit, AuthoritiesEdit from the navigation
    const navigationKeys = pageKeys.filter(
      (key) => !['edit', 'authoritiesEdit', 'auditLog'].includes(key)
    );

    return {
      navigation: navigationKeys.map((key) => pages[key]),
      routes: pageKeys.map((key) => pages[key]),
    };
  }, [isManager, isOwner, lease, match.url, property]);

  useEffect(() => {
    propertyId && dispatch(fetchProperty({ propertyId }));
  }, [propertyId]);

  useEffect(() => {
    if (propertyId) {
      const { agencyId, ownerId, tenantId } = property;

      if (agencyId) {
        // Manager can fetch Agency
        isManager && dispatch(fetchAgency({ agencyId }));
        // Set theme
        setTheme(agencyId);
      }

      if (isManager || isOwner) {
        // Manager or Owner can fetch Owner and Tenant
        ownerId && dispatch(fetchOwner({ ownerId }));
        tenantId && dispatch(fetchTenant({ tenantId }));
      }

      // Anyone can fetch Leases
      dispatch(fetchLeases({ propertyId }));
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      <NavSub items={filteredPages.navigation}>
        <Calculator lease={lease} />
      </NavSub>
      {property.id && (
        <Switch>
          {filteredPages.routes.map((route) => (
            <Route
              key={`Property.${route.title}`}
              path={route.to}
              render={route.render}
              exact={route.exact}
            />
          ))}
          <Route
            key={`Property.Transactions.WalletReport`}
            path={`${match.url}/transactions/walletReport`}
            render={renderWalletReport}
            exact={true}
          />
        </Switch>
      )}
    </>
  );
};

PropertyComponent.propTypes = {
  agency: PropTypes.object.isRequired,
  lease: PropTypes.object,
  leaseUpcoming: PropTypes.object,
  leaseRecentlyExpired: PropTypes.object,
  match: PropTypes.object.isRequired,
  primaryOwner: PropTypes.object,
  property: PropTypes.object.isRequired,
  propertyId: PropTypes.string.isRequired,
  tenant: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

// TODO: convert to hook (useSelector)
const mapStateToProps = (state, props) => {
  const { propertyId } = props.match.params;
  const property = getProperty(state.property, propertyId);
  const lease = getLeaseActive(state.lease, property.id);
  const leaseUpcoming = getLeaseUpcoming(state.lease, property.id);

  return {
    agency: getAgency(state.agency, property.agencyId),
    lease,
    leaseUpcoming,
    leaseRecentlyExpired:
      getLeasesExpiredByDaysAgo(state.lease, property.id, 60)[0] || {},
    primaryOwner: property.primaryOwner,
    property,
    propertyId,
    tenant: lease.primaryTenant || leaseUpcoming.primaryTenant || {},
    profile: state.profile,
  };
};

export const Property = connect(mapStateToProps)(PropertyComponent);
