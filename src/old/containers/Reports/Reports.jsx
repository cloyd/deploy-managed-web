import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import {
  ReportsData,
  ReportsEfficiency,
  ReportsManagement,
  ReportsOverview,
  ReportsRevenue,
} from '.';
import { useIsMobile } from '../../hooks';
import { NavSub } from '../../modules/Nav';
import { useReportsLinks } from '../../modules/Nav/hooks';
import {
  ReportsDetailArrears,
  ReportsDetailEfficiency,
  ReportsDetailLease,
  ReportsDetailManagement,
  ReportsDetailManager,
  ReportsDetailProperty,
  ReportsDetailRevenue,
} from './Detail';

export const ReportsComponent = ({ isDataReportsModuleEnabled }) => {
  const navItems = useReportsLinks(isDataReportsModuleEnabled);
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && <NavSub items={navItems} />}
      <Switch>
        <Route path="/reports" component={ReportsOverview} exact />
        <Route path="/reports/arrears" component={ReportsDetailArrears} exact />
        <Route path="/reports/efficiency" component={ReportsEfficiency} exact />
        <Route
          path="/reports/efficiency/:type"
          component={ReportsDetailEfficiency}
          exact
        />
        <Route path="/reports/management" component={ReportsManagement} exact />
        <Route
          path="/reports/management/:category/:type"
          component={ReportsDetailManagement}
          exact
        />
        <Route
          path="/reports/managers"
          component={ReportsDetailManager}
          exact
        />
        <Route
          path="/reports/property/:type"
          component={ReportsDetailProperty}
          exact
        />
        <Route path="/reports/financials" component={ReportsRevenue} exact />
        <Route
          path="/reports/financials/:type/:feeType"
          component={ReportsDetailRevenue}
          exact
        />
        <Route path="/reports/valuation" component={ReportsDetailLease} exact />
        <Route path="/reports/data" component={ReportsData} exact />
      </Switch>
    </>
  );
};

ReportsComponent.propTypes = {
  isDataReportsModuleEnabled: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isDataReportsModuleEnabled: state.profile.data.isDataReportsModuleEnabled,
});

export const Reports = connect(mapStateToProps)(ReportsComponent);
