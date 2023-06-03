import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Col, Table } from 'reactstrap';

import { toDollars } from '../../../utils';
import { Link } from '../../Link';

export const ReportLeaseDataTable = ({ isLoading, leases }) => {
  const headers = [
    'Lease ID',
    'Property ID',
    'Property',
    'Pay Frequency',
    'Weekly Rate',
    'Rental Amount',
    'Weekly Rate',
    'First Payment Date',
    'Lease Start Date',
    'Lease End Date',
    'Primary Owner Name',
    'Primary Owner Email',
    'Primary Tenant Name',
    'Primary Tenant Email',
    'Deposit Amount',
    'Bond Amount',
    'Status',
    'Agency',
    'Bond Number',
    'Termination Reason',
    'Termination Date',
    'Review Date',
    'Inspection Date',
    'Created at Date',
    'Updated at Date',
  ];

  return (
    <>
      {isLoading ? (
        <Col className="text-center py-3">
          <PulseLoader color="#dee2e6" />
        </Col>
      ) : leases.length > 0 ? (
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
              {leases.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.propertyId}</td>
                  <td>
                    {item.propertyAddress && item.propertyAddress.street},{' '}
                    {item.propertyAddress && item.propertyAddress.suburb},{' '}
                    {item.propertyAddress && item.propertyAddress.state},{' '}
                    {item.propertyAddress && item.propertyAddress.postcode}
                  </td>
                  <td>{item.payFrequency}</td>
                  <td>{toDollars(item.rentCents)}</td>
                  <td>{toDollars(item.averageWeeklyRentCents)}</td>
                  <td>{item.leaseStartDate}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>
                    {item.primaryOwner?.firstName} {item.primaryOwner?.lastName}
                  </td>
                  <td>{item.primaryOwner?.email}</td>
                  <td>
                    {item.primaryTenant && item?.primaryTenant?.firstName}{' '}
                    {item.primaryTenant && item?.primaryTenant?.lastName}
                  </td>
                  <td>{item.primaryTenant && item.primaryTenant.email}</td>
                  <td>{toDollars(item.depositCents)}</td>
                  <td>{toDollars(item.bondCents)}</td>
                  <td>{item.status}</td>
                  <td>{item.agency && item.agency.companyName}</td>
                  <td>{item.managerName}</td>
                  <td>{item.bondNumber}</td>
                  <td>{item.terminationReason}</td>
                  <td>{item.terminationDate}</td>
                  <td>{item.reviewDate}</td>
                  <td>{item.inspectionDate}</td>
                  <td>{item.createdAt}</td>
                  <td>{item.updatedAt}</td>
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
    </>
  );
};

ReportLeaseDataTable.propTypes = {
  leases: PropTypes.array,
  isLoading: PropTypes.bool,
};

ReportLeaseDataTable.defaultProps = {
  leases: [],
};
