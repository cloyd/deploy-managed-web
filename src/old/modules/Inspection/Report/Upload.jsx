import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Button } from 'reactstrap';

import { InspectionFormReportCreate, InspectionFormReportUpload } from '..';
import { useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';
import { ModalConfirm } from '../../Modal';

export const InspectionReportUpload = (props) => {
  const { isEdit, onCreateReport, onUploaderComplete, reportId, isArchived } =
    props;
  const hasCreatedReport = !!reportId;

  const [isOpen, actions] = useIsOpen(onUploaderComplete(reportId));

  return (
    <div className={props.className}>
      {isEdit ? (
        <ButtonIcon
          buttonColor="link"
          color="warning"
          className="text-nowrap"
          icon={['far', 'cloud-upload']}
          onClick={actions.handleOpen}
          disabled={isArchived}>
          <span className="text-warning">Upload report</span>
        </ButtonIcon>
      ) : (
        <Button
          color="primary"
          className="text-nowrap"
          data-testid="button-report-new-upload"
          outline
          onClick={actions.handleOpen}
          disabled={isArchived}>
          Upload new report
        </Button>
      )}
      <ModalConfirm
        isOpen={isOpen}
        title={isEdit ? 'Upload report file' : 'Upload new report'}
        size={'md'}
        onClosed={props.onClosed}>
        {!hasCreatedReport && onCreateReport ? (
          <>
            <p>
              Enter report details below, you can upload the file at a later
              time.
            </p>
            <InspectionFormReportCreate
              leases={props.leases}
              hasError={false}
              isLoading={false}
              btnSubmit={{ text: 'Next', color: 'primary' }}
              onCancel={actions.handleClose}
              onSubmit={onCreateReport}
            />
          </>
        ) : reportId && onUploaderComplete ? (
          <>
            <p>Upload a file to complete this report</p>
            <InspectionFormReportUpload
              reportId={reportId}
              hasError={false}
              isLoading={false}
              onCancel={actions.handleClose}
              onUploaderComplete={actions.handleSubmit}
            />
          </>
        ) : (
          <Alert color="warning">
            Warning: reportId is required for file upload.
          </Alert>
        )}
      </ModalConfirm>
    </div>
  );
};

InspectionReportUpload.propTypes = {
  className: PropTypes.string,
  isEdit: PropTypes.bool,
  leases: PropTypes.array,
  onClosed: PropTypes.func,
  onCreateReport: PropTypes.func,
  onUploaderComplete: PropTypes.func.isRequired,
  reportId: PropTypes.number,
  isArchived: PropTypes.bool,
};

InspectionReportUpload.defaultProps = {
  className: '',
  isEdit: false,
  leases: [],
};
