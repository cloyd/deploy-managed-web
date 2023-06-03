import PropTypes from 'prop-types';
import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Col, Table } from 'reactstrap';

import { Link } from '../../Link';

export const ReportTenantDataTable = ({ isLoading, tenants }) => {
  const headers = [
    'Tenant ID',
    'Tenant Status',
    'Property',
    'First name',
    'Last name',
    'Email',
    'Phone number',
    'Onboarded',
    'Lease ID',
    'Lease Status',
    'Made a payment?',
    'Agency',
    'Property Manager',
  ];

  return (
    <>
      {isLoading ? (
        <Col className="text-center py-3">
          <PulseLoader color="#dee2e6" />
        </Col>
      ) : tenants.length > 0 ? (
        <div
          style={{
            height: '30rem',
            position: 'relative',
            overflow: 'auto',
            width: '98%',
            margin: '0 auto',
          }}>
          <Table responsive>
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
              {tenants.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.tenantStatus}</td>
                  <td>
                    {item.address && item.address.street},{' '}
                    {item.address && item.address.suburb},{' '}
                    {item.address && item.address.state},{' '}
                    {item.address && item.address.postcode}
                  </td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td className="text-center">
                    {item.isOnboarded ? 'Yes' : 'No'}
                  </td>
                  <td>{item.leaseId}</td>
                  <td>{item.leaseStatus}</td>
                  <td>{item.hasPaymentMethod}</td>
                  <td>{item.agencyName}</td>
                  <td>{item.managerName}</td>
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

ReportTenantDataTable.propTypes = {
  tenants: PropTypes.array,
  isLoading: PropTypes.bool,
};

ReportTenantDataTable.defaultProps = {
  tenants: [],
};
