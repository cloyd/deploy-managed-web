import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Card, Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormField, FormLabel } from '@app/modules/Form';
import { withOnComplete } from '@app/modules/Form/withOnComplete';
import { QuoteFeeBreakdown } from '@app/modules/Marketplace';
import { withRouterHash } from '@app/modules/Route';
import { UploaderWidget } from '@app/modules/Uploader';

// TODO: this can be merged with MarketplaceFormQuoteCreate
const FormComponent = ({
  handleSubmit,
  isSubmitting,
  isValid,
  job,
  maxMarketplaceFeeCents,
  onCancel,
  onUploaderComplete,
  quote,
  tradieUser,
  values,
}) => {
  const handleUploaderComplete = useCallback(
    (data) => {
      onUploaderComplete && onUploaderComplete(data);
    },
    [onUploaderComplete]
  );

  return quote ? (
    <Form onSubmit={handleSubmit}>
      <Card className="bg-lavender p-4 mb-3">
        <FormGroup>
          <FormLabel for="bidDollars" isRequired>
            How much?
          </FormLabel>
          <FormField
            min="1"
            name="bidDollars"
            prepend="$"
            step="any"
            type="number"
          />
        </FormGroup>
        {values?.bidDollars > 0 && (
          <FormGroup>
            <p className="my-1 ml-2">Quote breakdown</p>
            <QuoteFeeBreakdown
              className="text-small"
              job={job}
              maxMarketplaceFeeCents={maxMarketplaceFeeCents}
              quote={quote}
              quoteAmount={values.bidDollars * 100}
              tradieUser={tradieUser}
            />
          </FormGroup>
        )}
        <FormGroup>
          <FormLabel for="tradieNote" isRequired>
            Quote details
          </FormLabel>
          <FormField name="tradieNote" rows={6} type="textarea" />
        </FormGroup>
        <FormGroup className="m-0">
          <FormLabel for="attachmentIds">Attachments</FormLabel>
          <UploaderWidget
            attachments={quote.attachments}
            attachableId={quote.id}
            attachableType="TradieQuote"
            onUploaderComplete={handleUploaderComplete}
          />
        </FormGroup>
      </Card>
      <FormButtons
        btnSubmit={{ text: quote.bidCents ? 'Submit quote' : 'Send quote' }}
        isSubmitting={isSubmitting}
        isValid={isValid}
        onCancel={onCancel}
      />
    </Form>
  ) : null;
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  invitedTradie: PropTypes.object,
  isLoadingUsers: PropTypes.bool,
  isQuotableWorkOrder: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  job: PropTypes.object,
  maxMarketplaceFeeCents: PropTypes.number,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onSendInvite: PropTypes.func,
  onSubmit: PropTypes.func,
  onUploaderComplete: PropTypes.func,
  quote: PropTypes.object,
  setFieldValue: PropTypes.func.isRequired,
  tradieUser: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  hasError: false,
  isQuotableWorkOrder: false,
  isSubmitting: false,
  isValid: false,
};

const config = {
  displayName: 'FormTaskQuoteEdit',
  enableReinitialize: true,

  mapPropsToValues: (props) => {
    const { isQuotableWorkOrder, job, quote } = props;

    return {
      bidDollars: quote?.bidCents ? quote?.bidCents / 100 : '',
      jobLimitDollars: isQuotableWorkOrder ? job?.budgetCents / 100 : 0,
      tradieNote: quote?.tradie?.note || '',
    };
  },

  validationSchema: Yup.object().shape({
    bidDollars: Yup.number()
      .min(1, 'Amount must be equal to or greater than $1')
      .required('Amount is required'),
    tradieNote: Yup.string().required('Job details are required'),
  }),

  handleSubmit: (values, { props }) => {
    const { bidDollars, isQuotableWorkOrder, ...otherValues } = values;
    const { quote } = props;

    props.onSubmit({
      ...otherValues,
      bidCents: bidDollars * 100,
      quoteId: quote.id,
    });
  },
};

export const MarketplaceFormQuoteEdit = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
