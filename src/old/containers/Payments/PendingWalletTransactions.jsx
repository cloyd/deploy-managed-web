import React from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';

import { CardLight } from '../../modules/Card';
import { selectProfileData } from '../../redux/profile';
import { TenantWalletTransaction } from './TenantWalletTransaction';
import { useFetchPendingTransactions } from './useWalletWithdrawal';

export const PendingWalletTransactions = () => {
  const profile = useSelector(selectProfileData);

  const {
    data: list,
    isLoading,
    isFetching,
  } = useFetchPendingTransactions({
    id: profile.id,
    status: 'pending',
  });

  return (
    <CardLight title="Pending Transactions" className="mb-3">
      <Container className="px-0">
        <Row className="d-none d-lg-flex text-small text-muted mb-3 mt-4 px-3  align-items-center">
          <Col lg={4}>Description</Col>
          <Col lg={4} className="d-flex align-items-center pt-2 pt-lg-0">
            Additional Information
          </Col>
          <Col lg={2}>Amount</Col>
          <Col lg={2}>Status</Col>
        </Row>
        {isLoading || isFetching ? (
          <div className="d-block py-4 text-center">
            <PulseLoader size={12} color="#dee2e6" />
          </div>
        ) : list?.length ? (
          <>
            <div className="overflow-auto wallet-transactions-list">
              {list.map((item, index) => (
                <TenantWalletTransaction
                  {...item}
                  key={`withdrawal-${item.id}-${index}`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="m-4 text-center">No pending transactions.</p>
        )}
      </Container>
    </CardLight>
  );
};

PendingWalletTransactions.propTypes = {};
PendingWalletTransactions.defaultProps = {};
