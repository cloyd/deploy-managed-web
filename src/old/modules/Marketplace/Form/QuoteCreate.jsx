import { withFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Card, Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormField, FormLabel } from '@app/modules//Form';
import { withOnComplete } from '@app/modules/Form/withOnComplete';
import { QuoteFeeBreakdown } from '@app/modules/Marketplace';
import { withRouterHash } from '@app/modules/Route';
import { UploaderWidgetIdsField } from '@app/modules/Uploader';

// TODO: this can be merged with MarketplaceFormQuoteEdit
const FormComponent = (props) => {
  const { handleSubmit, setFieldValue, values } = props;

  const handleChangeAttachmentIds = useCallback(
    (attachmetIds) => setFieldValue('attachmentIds', attachmetIds),
    [setFieldValue]
  );

  return (
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
              job={props.job}
              maxMarketplaceFeeCents={props.maxMarketplaceFeeCents}
              quoteAmount={values.bidDollars * 100}
              tradieUser={props.tradieUser}
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
          {!props.isSubmitting && (
            <UploaderWidgetIdsField
              onUploaderComplete={handleChangeAttachmentIds}
            />
          )}
        </FormGroup>
      </Card>
      <FormButtons
        btnSubmit={{ text: 'Send quote' }}
        isSubmitting={props.isSubmitting}
        isValid={props.isValid}
        onCancel={props.onCancel}
      />
    </Form>
  );
};

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  invitedTradie: PropTypes.object,
  isLoadingUsers: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  job: PropTypes.object,
  maxMarketplaceFeeCents: PropTypes.number,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onSendInvite: PropTypes.func,
  onSubmit: PropTypes.func,
  setFieldValue: PropTypes.func.isRequired,
  tradieUser: PropTypes.object,
  values: PropTypes.object.isRequired,
};

FormComponent.defaultProps = {
  hasError: false,
  isSubmitting: false,
  isValid: false,
  job: {},
};

const config = {
  displayName: 'FormTaskQuoteCreate',
  enableReinitialize: true,

  mapPropsToValues: () => ({
    bidDollars: 0,
  }),

  validationSchema: Yup.object().shape({
    bidDollars: Yup.number()
      .min(1, 'Amount must be equal to or greater than $1')
      .required('Amount is required'),
    tradieNote: Yup.string().required('Job details are required'),
  }),

  handleSubmit: (values, { props }) => {
    const { bidDollars, ...otherValues } = values;
    const { job } = props;

    props.onSubmit({
      ...otherValues,
      bidCents: bidDollars * 100,
      tradieJobId: job.id,
    });
  },
};

export const MarketplaceFormQuoteCreate = compose(
  withRouterHash,
  withFormik(config),
  withOnComplete
)(FormComponent);
