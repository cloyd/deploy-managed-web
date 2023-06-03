import PropTypes from 'prop-types';
import React from 'react';

import { ButtonIcon } from '../Button';

export const ReportHeading = (props) => (
  <div className={props.className}>
    <h3 className="w-100">{props.title}</h3>
    {props.onExport && !props.isExportHidden && (
      <ButtonIcon
        className="small d-print-none text-nowrap"
        disabled={props.isDisabled}
        icon={['fas', 'download']}
        title="Export CSV"
        onClick={props.onExport}>
        Export CSV
      </ButtonIcon>
    )}
  </div>
);

ReportHeading.propTypes = {
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  onExport: PropTypes.func,
  title: PropTypes.string,
  isExportHidden: PropTypes.bool,
};

ReportHeading.defaultProps = {
  className: 'd-sm-flex mb-2',
  isDisabled: false,
};
