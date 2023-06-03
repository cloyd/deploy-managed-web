import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

import {
  exportRentReportCSV,
  exportTaskReportCSV,
} from '../../../redux/report';
import { centsToDollar, toQueryObject } from '../../../utils';
import { ButtonIcon } from '../../Button';
import { Link } from '../../Link';

const ReportPaymentItemComponent = ({
  label,
  type,
  feeType,
  report,
  ...props
}) => {
  const { total, totalGst } = report;
  const { exportRentReportCSV, exportTaskReportCSV } = props;
  const isRent = type === 'rent';
  const hasAction = type && total;

  const location = useLocation();

  const linkTo = useMemo(() => {
    return hasAction
      ? `/reports/financials/${type}/${feeType}${location.search}`
      : null;
  }, [feeType, hasAction, location.search, type]);

  const params = useMemo(() => toQueryObject(location.search), [location]);

  const handleExport = useCallback(() => {
    (isRent ? exportRentReportCSV : exportTaskReportCSV)({
      reportType: type,
      params,
      feeType,
    });
  }, [isRent, exportRentReportCSV, exportTaskReportCSV, type, params, feeType]);

  return (
    <tr>
      <td>{label}</td>
      <td className="text-right">{centsToDollar(totalGst, true)}</td>
      <td className="text-right">{centsToDollar(total, true)}</td>
      <td className="text-right">
        {hasAction && (
          <>
            <Link to={linkTo} className="small d-print-none mr-2">
              Show Details
            </Link>
            <ButtonIcon
              title="Export CSV"
              icon={['fas', 'download']}
              className="small d-print-none"
              onClick={handleExport}
            />
          </>
        )}
      </td>
    </tr>
  );
};

ReportPaymentItemComponent.propTypes = {
  report: PropTypes.object,
  type: PropTypes.string,
  feeType: PropTypes.string,
  label: PropTypes.string,
  linkTo: PropTypes.string,
  exportRentReportCSV: PropTypes.func.isRequired,
  exportTaskReportCSV: PropTypes.func.isRequired,
};

ReportPaymentItemComponent.defaultProps = {
  report: {
    total: 0,
    totalGst: 0,
  },
};

const mapDispatchToProps = {
  exportRentReportCSV,
  exportTaskReportCSV,
};

export const ReportPaymentItem = connect(
  null,
  mapDispatchToProps
)(ReportPaymentItemComponent);
