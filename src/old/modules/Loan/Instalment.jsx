import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

import { useInstalmentStatuses } from '.';
import { centsToDollar, daysBetween, formatDate } from '../../utils';

export const LoanInstalment = ({ title, instalment, property }) => {
  const { amountCents, dueDate, intentionId } = instalment;
  const { isDue, isPaid, isProcessing, isFailure } =
    useInstalmentStatuses(instalment);

  const dueMessage = useMemo(() => {
    const daysTillDue = daysBetween(dueDate);

    if (!isDue || daysTillDue > 7) {
      return;
    }

    if (daysTillDue === 0) {
      return 'Due today';
    }

    if (daysTillDue === 1) {
      return 'Due tomorrow';
    }

    return `Due in ${daysTillDue} days`;
  }, [dueDate, isDue]);

  const linkTo = useMemo(() => {
    return `/payments/${intentionId}?leaseId=${property.leaseId}&propertyId=${property.id}`;
  }, [intentionId, property]);

  return (
    <tr className={`${isPaid && 'text-muted'}`} data-testid="row">
      <td className="align-middle pl-3" data-testid="title">
        {title}
      </td>
      <td className="align-middle" data-testid="date">
        {dueMessage ? (
          <>
            <span className="text-danger">{dueMessage}</span>
            <span className="px-2">-</span>
          </>
        ) : (
          <span>Due </span>
        )}
        {formatDate(dueDate)}
      </td>
      <td className="align-middle text-right" data-testid="amount">
        {centsToDollar(amountCents)}
      </td>
      <td className="align-middle text-right pr-3" data-testid="action">
        {isDue && (
          <Link to={linkTo} className="btn btn-primary">
            Pay
          </Link>
        )}
        {isPaid && <Badge color="success">Paid</Badge>}
        {isProcessing && <Badge color="warning">Processing</Badge>}
        {isFailure && <Badge color="danger">Failed</Badge>}
      </td>
    </tr>
  );
};

LoanInstalment.propTypes = {
  title: PropTypes.string.isRequired,
  instalment: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};
