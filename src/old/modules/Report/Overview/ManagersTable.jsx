import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'reactstrap';

import { Link } from '../../Link';

export const ReportOverviewManagersTable = (props) => {
  const { className, managers } = props;

  return (
    <div className={className}>
      <Table responsive>
        <thead>
          <tr>
            <th className="align-top">ID</th>
            <th className="align-top">Manager Name</th>
            <th className="align-top">Primary Agency</th>
            <th className="align-top">Number of properties</th>
          </tr>
        </thead>
        <tbody>
          {managers.length > 0 ? (
            managers.map((manager) => (
              <ReportOverviewManagersRow key={manager.id} manager={manager} />
            ))
          ) : (
            <tr>
              <td className="text-center" colSpan={4}>
                No managers to show.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

ReportOverviewManagersTable.propTypes = {
  className: PropTypes.string,
  managers: PropTypes.array,
};

ReportOverviewManagersTable.defaultProps = {
  className: '',
  managers: [],
};

const ReportOverviewManagersRow = (props) => {
  const { manager } = props;

  return (
    <tr>
      <td>{manager.id}</td>
      <td>
        <Link href={`/contacts/managers/${manager.id}`} className="text-left">
          {manager.name}
        </Link>
      </td>
      <td>{manager.agencyName}</td>
      <td>{manager.numberOfProperties}</td>
    </tr>
  );
};

ReportOverviewManagersRow.propTypes = {
  manager: PropTypes.object,
};

ReportOverviewManagersRow.defaultProps = {
  manager: {},
};
