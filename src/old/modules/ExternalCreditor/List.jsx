import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table } from 'reactstrap';

import { CardLight } from '../Card';
import { ContentBooleanIcon } from '../Content';

// TODO: use react-table to manage data table or data grids

const columns = [
  {
    id: 'businessName',
    name: 'Business name',
  },
  {
    id: 'contactName',
    name: 'Contact name',
  },
  {
    id: 'email',
    name: 'Email',
  },
  {
    id: 'mobile',
    name: 'Mobile',
  },
  {
    id: 'adminFee',
    name: 'Admin fee',
  },
];

export const ExternalCreditorList = ({
  search,
  tradies,
  hiddenColumns = [],
}) => (
  <CardLight className="pt-2 pb-1 px-3 mb-3" data-testid="user-list">
    <Table responsive className="m-0">
      <thead>
        <tr>
          {columns
            .filter((column) => !hiddenColumns.includes(column.name))
            .map((column) => (
              <th key={column.id} className="border-top-0 pl-1">
                {column.name}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {tradies && tradies.length > 0 ? (
          tradies.map(
            (tradie) =>
              tradie.id && (
                <ExternalCreditorListRow
                  key={`user-${tradie.id}`}
                  search={search}
                  tradie={tradie}
                  hiddenColumns={hiddenColumns}
                />
              )
          )
        ) : (
          <tr>
            <td className="pl-1" colSpan={4}>
              Currently no tradies have been added.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </CardLight>
);

ExternalCreditorList.propTypes = {
  search: PropTypes.string,
  tradies: PropTypes.array,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
};

ExternalCreditorList.defaultProps = {
  tradies: [],
  hiddenColumns: [],
};

const ExternalCreditorListRow = ({ tradie, search, hiddenColumns = [] }) => {
  const location = useLocation();

  const linkTo = {
    pathname: `${location.pathname}/tradie/${tradie.id}`,
    search: search,
  };

  const cols = columns.filter((column) => !hiddenColumns.includes(column.name));

  const renderCell = (col) => {
    switch (col.id) {
      case 'businessName':
        return (
          <Link color="primary" to={linkTo}>
            {tradie.promisepayUserPromisepayCompanyLegalName}
          </Link>
        );

      case 'contactName':
        return (
          <Link color="primary" to={linkTo}>
            {tradie.name}
          </Link>
        );

      case 'email':
        return (
          tradie.primaryContactEmail && (
            <a
              href={`mailto:${tradie.primaryContactEmail}`}
              className="btn-link">
              {tradie.primaryContactEmail}
            </a>
          )
        );

      case 'mobile':
        return (
          tradie.primaryContactMobile && (
            <a href={`tel:${tradie.primaryContactMobile}`} className="btn-link">
              {tradie.primaryContactMobile}
            </a>
          )
        );

      case 'adminFee':
        return <ContentBooleanIcon value={tradie.agencyPaysAdminFee} />;

      default:
        return null;
    }
  };

  return (
    <tr data-testid="user-list-row">
      {cols.map((col) => (
        <td
          key={col.id}
          className={`pl-1 ${
            col.id === 'businessName' ||
            (col.id === 'contactName' && 'text-nowrap')
          } ${col.id === 'adminFee' && 'text-center'}`}>
          {renderCell(col)}
        </td>
      ))}
    </tr>
  );
};

ExternalCreditorListRow.propTypes = {
  search: PropTypes.string,
  tradie: PropTypes.object,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string),
};
