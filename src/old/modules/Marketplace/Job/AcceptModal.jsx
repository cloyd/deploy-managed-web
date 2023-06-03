import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import { useIsOpen } from '@app/hooks';
import { ButtonIcon } from '@app/modules/Button';
import { ContentWithLabel } from '@app/modules/Content';
import { ModalConfirm } from '@app/modules/Modal';
import { getProfile } from '@app/redux/profile';
import { getExternalCreditor } from '@app/redux/users';
import { centsToDollar, toPercentFormattedAmount } from '@app/utils';

/**
 * Accept job confirmation component - should be used by tradies
 * when they accept work orders.
 */
export const JobAcceptModal = ({ className, job, quote, onSubmit }) => {
  const [isOpen, openActions] = useIsOpen(onSubmit);

  const tradie = useSelector((state) => {
    const profile = getProfile(state.profile);
    return getExternalCreditor(state.users, profile.id);
  });

  const feeMessage = useMemo(() => {
    const isRequested = !!quote.requester?.id;
    const hasAdminFee = !!job.adminFeeCents;
    const hasAgencyFee = !!job.percentageAgencyFee && isRequested;
    const hasMarketplaceFee = !!tradie.percentageMarketplaceFee && !isRequested;

    if (!hasAdminFee && !hasAgencyFee && !hasMarketplaceFee) {
      return;
    }

    const message = ['This job attracts'];

    if (hasAdminFee) {
      const value = centsToDollar(job.adminFeeCents, 2);
      message.push(`a ${value} admin fee`);
    }

    if (hasAdminFee && (hasMarketplaceFee || hasAgencyFee)) {
      message.push('plus');
    }

    if (hasMarketplaceFee) {
      const value = toPercentFormattedAmount(tradie.percentageMarketplaceFee);
      message.push(`a ${value} marketplace fee`);
    }

    if (hasAgencyFee) {
      const value = toPercentFormattedAmount(job.percentageAgencyFee);
      message.push(`a ${value} agency fee`);
    }

    message.push('which will be deducted from your final payment');

    return message.join(' ');
  }, [job, quote, tradie]);

  const content = useMemo(() => {
    return job.myQuote
      ? {
          alert: 'Great job on accepting the work order!',
          btn: 'Accept',
          title: 'Accept this job',
        }
      : {
          alert:
            "Its great you're available for the work order! We will let the agency know that you would like to do the job and they can assign it to you.",
          btn: "I'm Available",
          title: 'Availability for this job',
        };
  }, [job]);

  return (
    <div className={className}>
      <ButtonIcon
        color="success"
        direction="column"
        icon={['far', 'check']}
        size="2x"
        onClick={openActions.handleOpen}>
        <small>{content.btn}</small>
      </ButtonIcon>
      <ModalConfirm
        btnCancel={{ text: 'Cancel' }}
        btnSubmit={{ text: content.btn, color: 'success' }}
        isOpen={isOpen}
        size="lg"
        title={content.title}
        onCancel={openActions.handleClose}
        onSubmit={openActions.handleSubmit}>
        <Alert color="primary">
          <p>{content.alert}</p>
          <p className="mb-0">
            The job limit is a guide. If you think the job will cost more,
            please contact the agency via phone or by simply replying to the job
            in your Managed App Profile.
          </p>
        </Alert>
        <ContentWithLabel label="Job title" value={job.title} />
        <ContentWithLabel label="Note" value={job.description} />
        <ContentWithLabel label="Address" value={job.property?.address} />
        <ContentWithLabel label="Job limit">
          <p>
            {centsToDollar(job.budgetCents)}
            <span className="font-italic ml-3">
              (Seek agency approval if the job will cost more)
            </span>
          </p>
        </ContentWithLabel>
        {feeMessage && (
          <ContentWithLabel label="Managed App Fee" value={feeMessage} />
        )}
      </ModalConfirm>
    </div>
  );
};

JobAcceptModal.propTypes = {
  className: PropTypes.string,
  job: PropTypes.object,
  quote: PropTypes.object,
  onSubmit: PropTypes.func,
};

JobAcceptModal.defaultProps = {
  job: {},
  quote: {},
};
