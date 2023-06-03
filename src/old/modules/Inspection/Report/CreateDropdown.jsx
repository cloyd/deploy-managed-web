import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import startCase from 'lodash/fp/startCase';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';

import { InspectionFormReportCreate, useInspectionTypes } from '..';
import { useIsOpen } from '../../../hooks';
import { Dropdown } from '../../Dropdown';
import { ModalConfirm } from '../../Modal';

export const InspectionReportCreateDropdown = (props) => {
  const [selectedType, setSelectedType] = useState();
  const [isOpen, actions] = useIsOpen(props.onCreateReport);
  const inspectionTypes = useInspectionTypes(props.leases);

  const handleDropdownItem = useCallback(
    (type) => () => {
      setSelectedType(type);
      actions.handleOpen();
    },
    [actions]
  );

  const dropdownItems = useMemo(
    () =>
      inspectionTypes.map((type) => ({
        title: startCase(type),
        onClick: handleDropdownItem(type),
      })),
    [handleDropdownItem, inspectionTypes]
  );

  return (
    <div
      className={props.className}
      data-testid="inspection-report-create-dropdown">
      <Dropdown
        isDisabled={props.isDisabled}
        items={dropdownItems}
        toggleColor="primary">
        <span className="text-nowrap">
          Start an inspection <FontAwesomeIcon icon={['far', 'chevron-down']} />
        </span>
      </Dropdown>
      <ModalConfirm
        isOpen={isOpen}
        size="md"
        title={`${startCase(selectedType)} Inspection`}>
        <p className="mb-1">
          Create a draft {startCase(selectedType)} Inspection{' '}
        </p>
        <div className="d-block mt-3">
          <InspectionFormReportCreate
            hasError={false}
            isLoading={false}
            leases={props.leases}
            reportType={selectedType}
            onCancel={actions.handleClose}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </ModalConfirm>
    </div>
  );
};

InspectionReportCreateDropdown.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  leases: PropTypes.array,
  onCreateReport: PropTypes.func.isRequired,
};

InspectionReportCreateDropdown.defaultProps = {
  className: '',
  leases: [],
};
