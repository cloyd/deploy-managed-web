import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IconJob } from '../Marketplace';
import { useRolesContext } from '../Profile';

/*
 * Show intention information and link to relevant jobs/tasks
 */
export const PaymentInfo = (props) => {
  const { intention, ...otherProps } = props;
  const {
    formatted,
    isComplete,
    isRefund,
    isRent,
    isTask,
    supersedingReason,
    isDraft,
  } = intention;
  const { paidAt, autoPayWithYear, endWithYear, startWithYear, dueWithYear } =
    formatted?.dates || {};

  return (
    <div {...otherProps}>
      <PaymentTitle intention={intention} />
      {isRent && (
        <div>
          <small className="d-block">
            {startWithYear} - {endWithYear}
            <br />
            {!isComplete && !isRefund && (
              <span className="text-muted">
                {autoPayWithYear
                  ? `Automatic payment on ${autoPayWithYear}`
                  : `Payment due on ${dueWithYear}`}
                <br />
                Transaction will take approx. 3 days to complete processing
              </span>
            )}
          </small>
        </div>
      )}
      {paidAt && (
        <small className="d-block">
          <span className="text-muted">{`${
            intention.isWalletDischarge ? 'Date paid' : 'Payment received'
          } ${paidAt}`}</span>
        </small>
      )}
      {isTask && !isComplete && !isRefund && (
        <small className="d-block text-muted">
          Payment due on {dueWithYear}
        </small>
      )}
      {!isComplete && isDraft && supersedingReason === 'payment_failed' && (
        <small className="d-block text-danger">
          Payment failed, please try again.
        </small>
      )}
    </div>
  );
};

PaymentInfo.propTypes = {
  intention: PropTypes.object.isRequired,
};

/*
 * Component that determines title & link based on the intention and user role
 */
const PaymentTitle = (props) => {
  const { intention } = props;
  const roles = useRolesContext();

  const link = useMemo(() => {
    let path;

    if (intention.tradieJob?.id && roles.isExternalCreditor) {
      path = `/marketplace/${intention.tradieJob?.id}`;
    } else if (intention.tradieJob?.id && (roles.isManager || roles.isOwner)) {
      path = `/property/${intention.property?.id}/tasks/${intention.taskId}/job`;
    } else if (intention.isTask && (roles.isManager || roles.isOwner)) {
      path = `/property/${intention.property?.id}/tasks/${intention.taskId}`;
    }

    return path;
  }, [intention, roles]);

  const title = useMemo(() => {
    if (intention.isWalletDischarge) {
      return intention.type === 'loan_discharge'
        ? 'Loan wallet disbursement'
        : 'Payment to owner';
    } else {
      return intention.tradieJob?.title || intention.title;
    }
  }, [intention]);

  return link ? (
    <Link to={link}>
      <strong className="d-block text-capitalize text-primary">
        <IconJob
          className="mr-1"
          hasWorkOrder={intention.tradieJob?.hasWorkOrder}
          tradieJobId={intention.tradieJob?.id}
        />
        {intention.tradieJob?.title || intention.title}
      </strong>
    </Link>
  ) : (
    <strong className="d-block text-capitalize">
      <IconJob
        className="mr-1"
        hasWorkOrder={intention.tradieJob?.hasWorkOrder}
        tradieJobId={intention.tradieJob?.id}
      />
      {title}
    </strong>
  );
};

PaymentTitle.propTypes = {
  intention: PropTypes.object.isRequired,
};
