import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Col, Table } from 'reactstrap';

import { toDollars, toPercent } from '../../../utils';
import { Link } from '../../Link';
import { Pagination } from '../../Pagination';

export const ReportPropertyDataTable = ({ isLoading, properties }) => {
  const headers = [
    'Property ID',
    'Street Address',
    'Owner type',
    'Owner',
    'Contact email',
    'Property type',
    'Property category',
    'Percentage management fee',
    'Letting fee metric',
    'Letting fee unit',
    'Lease renewal metric',
    'Lease renewal unit',
    'Admin fee',
    'Advertising fee',
    'Approved work order limit',
    'Archived at',
    'Legacy',
    'Agency',
    'Manager',
    'Property Key',
  ];

  return (
    <>
      {isLoading ? (
        <Col className="text-center py-3">
          <PulseLoader color="#dee2e6" />
        </Col>
      ) : properties.length > 0 ? (
        <div
          style={{
            height: '30rem',
            position: 'relative',
            overflow: 'auto',
            width: '98%',
            margin: '0 auto',
          }}>
          <Table className="responsive-sm">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    className="align-top sticky-top bg-white border-top-0"
                    key={header}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((item) => (
                <tr key={item.id}>
                  <td>{item?.id}</td>
                  <td>
                    {item?.address && item.address.street},{' '}
                    {item?.address && item.address.suburb},{' '}
                    {item?.address && item.address.state},{' '}
                    {item?.address && item.address.postcode}
                  </td>
                  <td>{item?.company ? 'company' : 'private'}</td>
                  <td>
                    {item?.primaryOwner?.firstName}{' '}
                    {item?.primaryOwner?.lastName}
                  </td>
                  <td>{item?.primaryOwner?.email}</td>
                  <td>{item?.propertyType}</td>
                  <td>
                    {item?.propertyFeature && item?.propertyFeature?.typeOf}
                  </td>
                  <td>{toPercent(item?.percentageManagementFee)}</td>
                  <td>{toPercent(item?.lettingFeeMetric)}</td>
                  <td>{item?.lettingFeeUnit}</td>
                  <td>{toPercent(item?.leaseRenewalMetric)}</td>
                  <td>{item?.leaseRenewalUnit}</td>
                  <td>{toDollars(item?.adminFeeCents)}</td>
                  <td>{toDollars(item?.advertisingFeeCents)}</td>
                  <td>{toDollars(item?.workOrderLimitCents)}</td>
                  <td>{item?.archivedAt}</td>
                  <td>{item?.legacyId}</td>
                  <td>{item?.agency && item?.agency?.companyName}</td>
                  <td>{item?.managerName}</td>
                  <td>
                    {item?.propertyKeys.length > 0
                      ? `${item.propertyKeys[0].identifier}-${item.propertyKeys[0].holder}`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Col className="py-4 text-center">
          An active property hasn&apos;t been set up yet. You&apos;ll get a
          notification, but in the meantime please check we&apos;ve got
          <Link to="/profile">&nbsp;your profile details</Link> correct.
        </Col>
      )}
      <Pagination className="mt-2" name="properties" />
    </>
  );
};

ReportPropertyDataTable.propTypes = {
  properties: PropTypes.array,
  isLoading: PropTypes.bool,
};

ReportPropertyDataTable.defaultProps = {
  properties: [],
};
