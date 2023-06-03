import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'reactstrap';

import { DonutChart } from '.';

export const ChartColumn = ({ title, className, children, xs, lg }) => (
  <Col className="py-4" xs={xs} lg={lg}>
    <Card className="h-100">
      <CardHeader className="bg-white border-400">
        <CardTitle className="mb-0" tag="h5">
          {title}
        </CardTitle>
      </CardHeader>
      <CardBody className={`d-flex justify-content-center ${className}`}>
        {children}
      </CardBody>
    </Card>
  </Col>
);

export const LeaseChartColumn = ({
  title,
  labels,
  series,
  colors,
  isSemiDonut,
  isExpired = false,
  isUpcoming = false,
  isRentReviews = false,
}) => (
  <ChartColumn title={title} xs={12} lg={6}>
    <DonutChart
      labels={labels}
      series={series}
      colors={colors}
      isSemiDonut={isSemiDonut}
      isExpired={isExpired}
      isUpcoming={isUpcoming}
      isRentReviews={isRentReviews}
    />
  </ChartColumn>
);

ChartColumn.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  xs: PropTypes.number,
  lg: PropTypes.number,
};

LeaseChartColumn.propTypes = {
  title: PropTypes.string,
  labels: PropTypes.array,
  series: PropTypes.array,
  colors: PropTypes.array,
  isSemiDonut: PropTypes.bool,
  isExpired: PropTypes.bool,
  isUpcoming: PropTypes.bool,
  isRentReviews: PropTypes.bool,
};
