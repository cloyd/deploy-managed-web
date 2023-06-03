import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React from 'react';

import { InspectionFormReportCreateWithLease } from '..';
import { useIsOpen } from '../../../hooks';
import { ButtonIcon } from '../../Button';
import { Link } from '../../Link';
import { ModalConfirm } from '../../Modal';

/**
 * Button that either creates an inspection report off a task, or links to one
 *
 * @param {*} leases array of property leases
 * @param {function} onCreateReport form on submit action
 * @param {*} task task to create the report from
 */
export const InspectionReportCreateButton = (props) => {
  const { task } = props;
  const [isOpen, actions] = useIsOpen(props.onCreateReport);

  return task.id ? (
    <div data-testid="inspection-report-create-button">
      {task.inspectionReportId ? (
        <Link
          to={`/property/${task.propertyId}/condition/report/${task.inspectionReportId}`}>
          <ButtonIcon
            direction="column"
            icon={['far', 'clipboard-list']}
            size="2x"
            onClick={actions.handleOpen}>
            <small>Condition</small>
          </ButtonIcon>
        </Link>
      ) : (
        <ButtonIcon
          direction="column"
          icon={['far', 'clipboard-list']}
          size="2x"
          onClick={actions.handleOpen}>
          <small>Condition</small>
        </ButtonIcon>
      )}
      <ModalConfirm
        isOpen={isOpen}
        size="md"
        title={`${startCase(task?.taskCategory?.key)} Inspection`}>
        <p className="mb-1">
          Create a draft {startCase(task?.taskCategory?.key)} Inspection{' '}
        </p>
        <div className="d-block mt-3">
          <InspectionFormReportCreateWithLease
            hasError={false}
            isLoading={false}
            lease={props.lease}
            reportType={task?.taskCategory?.key}
            onCancel={actions.handleClose}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </ModalConfirm>
    </div>
  ) : null;
};

InspectionReportCreateButton.propTypes = {
  lease: PropTypes.object,
  onCreateReport: PropTypes.func.isRequired,
  task: PropTypes.object,
};

InspectionReportCreateButton.defaultProps = {
  lease: {},
  task: {},
};
