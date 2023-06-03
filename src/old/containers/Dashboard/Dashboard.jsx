import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import {
  ArrearsChart,
  ChartColumn,
  LeaseChartColumn,
  RadialChart,
} from "../../modules/Dashboard";
import { Header } from "../../modules/Header";
import { useRolesContext } from "../../modules/Profile";
import { fetchDashboardData } from "../../redux/dashboard";
import { COLORS, LEASES } from "../../redux/dashboard/constants";
import { DashboardProvider } from "../Dashboard";

const { RED, BLUE, YELLOW, GREEN, ORANGE } = COLORS;

/*
TODO:
export const Dashboard = () => {
	  const dispatch = useDispatch();
	  const profile = useSelector((state) => getProfile(state.profile));
	  const { arrears, leases: leasesData, portfolioMetrics } = useSelector(
	    (state) => state.dashboard // TODO: create dashboard selector
	  );
*/

const DashboardComponent = ({ dashboardData, fetchDashboardData, profile }) => {
  const [arrears, setArrears] = useState();
  const history = useHistory();
  const { isCorporateUser, isManager, isPrincipal } = useRolesContext();
  const handleClick = useCallback(
    (url, param = "") => {
      history.push(
        `/reports/${url}resource_id=${profile.id}&resource_type=manager&source_url=dashboard${param}`
      );
    },
    [history, profile.id]
  );

  /*
    TODO:
    useEffect(() => {
      const managerId = profile.id;
      if (managerId) {
        dispatch(fetchDashboardData({ managerId }));
      }
    }, [dispatch, profile.id]);
  */
  const [data, setData] = useState();

  useEffect(() => {
    const managerId = profile.id;
    if (managerId) {
      fetchDashboardData({ managerId });
    }
  }, [fetchDashboardData, profile.id]);

  useEffect(() => {
    if (dashboardData) {
      setArrears({
        percent: {
          data: dashboardData.arrears.percent.percentage,
          days: dashboardData.arrears.percent.days,
        },
        days: { data: dashboardData.arrears.days },
      });
      setData(dashboardData);
    }
  }, [dashboardData]);

  return (
    <DashboardProvider
      // eslint-disable-next-line react/jsx-no-bind
      handleClick={handleClick}
      isClickable={(isManager || isPrincipal) && !isCorporateUser}
    >
      <Header title="Dashboard" />
      <Container className="wrapper d-flex flex-column justify-content-center align-items-center">
        {data && (
          <>
            <Row className="w-100">
              <Col className="py-4" xs={12} lg={8}>
                <ArrearsChart data={arrears} />
              </Col>
              <ChartColumn
                title="My Properties"
                className="px-0"
                xs={12}
                lg={4}
              >
                <RadialChart
                  labels={["Vacant", "Pending", "Leased"]}
                  series={[
                    data?.portfolioMetrics?.vacant || 0,
                    data?.portfolioMetrics?.pending || 0,
                    data?.portfolioMetrics?.leased || 0,
                  ]}
                  colors={[YELLOW, BLUE, GREEN]}
                  total={data?.portfolioMetrics?.total || 0}
                />
              </ChartColumn>
            </Row>
            <Row className="w-100">
              <LeaseChartColumn
                title="My Leases"
                labels={["Current", "Periodic", "Expired"]}
                series={[
                  data?.leaseStatuses?.current || 0,
                  data?.leaseStatuses?.periodic || 0,
                  data?.leaseStatuses?.expired || 0,
                ]}
                colors={[GREEN, BLUE, YELLOW]}
                isSemiDonut
              />
              <LeaseChartColumn
                title="Expired Leases"
                labels={LEASES.DAYS_LABELS}
                series={data?.leases?.expired}
                colors={[GREEN, YELLOW, ORANGE, RED]}
                isExpired={true}
              />
            </Row>
            <Row className="w-100">
              <LeaseChartColumn
                title="Upcoming Leases Renewals"
                labels={LEASES.DAYS_LABELS}
                series={data?.leases?.upcoming}
                colors={[RED, ORANGE, YELLOW, GREEN]}
                isUpcoming={true}
              />
              <LeaseChartColumn
                title="Rent Reviews"
                labels={["Upcoming", "Overdue", "No Date"]}
                series={[
                  data?.rentReviews?.upcoming || 0,
                  data?.rentReviews?.overdue || 0,
                  data?.rentReviews?.noDate || 0,
                ]}
                colors={[GREEN, YELLOW, BLUE]}
                isSemiDonut
                isRentReviews={true}
              />
            </Row>
          </>
        )}
      </Container>
    </DashboardProvider>
  );
};

DashboardComponent.propTypes = {
  dashboardData: PropTypes.object,
  fetchDashboardData: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = ({ profile, dashboard }) => {
  const { dashboardData } = dashboard;

  return {
    dashboardData,
    profile: profile.data,
  };
};

const mapDispatchToProps = {
  fetchDashboardData,
};

export const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardComponent);
