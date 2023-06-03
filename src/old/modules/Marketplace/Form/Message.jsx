import { FormikProvider, useFormik } from 'formik';
import compose from 'lodash/fp/compose';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { Form, FormGroup } from 'reactstrap';
import * as Yup from 'yup';

import { FormButtons, FormLabel } from '../../Form';
import InputField from '../../Form/Field/InputField';
import { withRouterHash } from '../../Route/withRouterHash';
import { UploaderWidgetIdsField } from '../../Uploader';

const FormMessageSchema = Yup.object().shape({
  content: Yup.string().required('Message is required'),
});

const initialValues = {
  content: '',
};

const Message = ({ toName, quoteId, onSubmit, isLoading }) => {
  const formik = useFormik({
    initialValues,
    validationSchema: FormMessageSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm();
      onSubmit({
        content: values.content,
        attachmentIds: values.attachmentIds,
        tradieQuoteId: quoteId,
      });
    },
  });

  const handleSetFieldValue = useCallback(
    (attachmetIds) => formik.setFieldValue('attachmentIds', attachmetIds),
    [formik]
  );

  return (
    <FormikProvider value={formik}>
      <Form
        data-testid="marketplace-message-form"
        onSubmit={formik.handleSubmit}>
        <FormGroup>
          <FormLabel for="content" isRequired>
            {toName ? `Reply to ${toName}` : 'Message'}
          </FormLabel>
          <InputField name="content" type="textarea" />
        </FormGroup>
        <FormGroup>
          <FormLabel for="attachmentIds">Attachments</FormLabel>
          {!formik.isSubmitting && (
            <UploaderWidgetIdsField onUploaderComplete={handleSetFieldValue} />
          )}
        </FormGroup>
        <FormButtons
          isSubmitting={formik.isSubmitting || isLoading}
          isValid={formik.isValid && formik.dirty}
        />
      </Form>
    </FormikProvider>
  );
};

Message.propTypes = {
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  quoteId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  toName: PropTypes.string,
};

Message.defaultProps = {
  hasError: false,
};

export const MarketplaceFormMessage = compose(withRouterHash)(Message);
