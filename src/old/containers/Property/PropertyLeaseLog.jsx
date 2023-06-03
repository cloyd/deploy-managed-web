import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import { Container } from 'reactstrap';

import {
  fetchLeaseLog,
  selectIsLeaseLoading,
  selectLeaseLog,
} from '../../redux/lease';
import { LeaseLogList } from './PropertyLease/LeaseLogList';

export const PropertyLeaseLog = ({ leaseId, payFrequency }) => {
  const dispatch = useDispatch();

  const leaseLog = useSelector(selectLeaseLog);
  const isLoading = useSelector(selectIsLeaseLoading);

  useEffect(() => {
    dispatch(fetchLeaseLog({ leaseId }));
  }, [dispatch, leaseId]);

  return (
    <Container className="mt-3 property-lease-log">
      {isLoading ? (
        <PulseLoader size={12} color="#dee2e6" />
      ) : leaseLog?.length ? (
        <LeaseLogList leaseLog={leaseLog} payFrequency={payFrequency} />
      ) : (
        'There are currently no changes to this lease.'
      )}
    </Container>
  );
};

PropertyLeaseLog.propTypes = {
  leaseId: PropTypes.number,
  payFrequency: PropTypes.string,
};

PropertyLeaseLog.defaultProps = {};
