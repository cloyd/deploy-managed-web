/* eslint-disable react/jsx-no-bind */
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Col, Container, Row } from 'reactstrap';

import { useLocationParams } from '../../hooks';
import { CardLight } from '../../modules/Card';
import { Filter } from '../../modules/Filter';
import { Pagination } from '../../modules/Pagination';
import { selectProfileData } from '../../redux/profile';
import { TenantWalletTransaction } from './TenantWalletTransaction';
import {
  useFetchPendingTransactions,
  useFetchWalletTransactions,
} from './useWalletWithdrawal';

export const WalletTransactions = ({ history }) => {
  const profile = useSelector(selectProfileData);
  const [fromDate, setFromDate] = useState('');

  const params = useLocationParams();

  // fetch wallet transactions only after pending transactions have been successfully fetched
  const { isSuccess } = useFetchPendingTransactions({
    id: profile.id,
    status: 'pending',
  });

  const {
    data: list,
    refetch,
    isLoading,
    isFetching,
  } = useFetchWalletTransactions({
    id: profile.id,
    params,
    enabled: false,
  });

  useEffect(() => {
    isSuccess && refetch(params);
  }, [params, refetch, isSuccess]);

  const handleClearFilter = useCallback(() => {
    history.push('/payments/wallet?page=1');
  }, [history]);

  return (
    <CardLight title="Transactions" className="mb-3">
      <Filter name="withdrawals" isSaved={false}>
        <Container className="px-0">
          <Formik>
            <Row className="mb-3 d-flex align-items-center">
              <Col xs={12} md={6} lg={4}>
                <Filter.Date
                  label="From"
                  name="q[createdAtGteq]"
                  customOnChange={setFromDate}
                  datePickerProps={{
                    maxDate: new Date(),
                  }}
                />
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Filter.Date
                  label="to"
                  name="q[createdAtLteq]"
                  datePickerProps={{
                    ...(fromDate && {
                      minDate: new Date(fromDate),
                    }),
                    maxDate: new Date(),
                  }}
                />
              </Col>
              <Col lg={4}>
                <Row className="pr-3">
                  <Col xs={6} className="pt-2 text-center">
                    <Filter.Clear onClick={handleClearFilter} />
                  </Col>
                  <Col
                    xs={6}
                    className="pl-3 pl-md-1 pl-lg-2 pr-lg-1 flex-lg-fill text-center">
                    <Filter.Submit
                      className="mt-1 w-100"
                      color="primary"
                      size="md">
                      Filter
                    </Filter.Submit>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Formik>

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
                <Pagination
                  className="mt-3"
                  name="transactions"
                  isReload={false}
                />
              </div>
            </>
          ) : (
            <p className="m-4 text-center">No transactions found.</p>
          )}
        </Container>
      </Filter>
    </CardLight>
  );
};

WalletTransactions.propTypes = {
  history: PropTypes.object.isRequired,
};
WalletTransactions.defaultProps = {};
