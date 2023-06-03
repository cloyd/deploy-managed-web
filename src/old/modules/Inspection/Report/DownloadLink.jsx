import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';

export const InspectionReportDownloadLink = (props) =>
  props.link && (
    <a
      className="btn btn-link text-nowrap"
      href={props.link}
      target="_blank"
      rel="noopener noreferrer">
      <FontAwesomeIcon
        icon={['far', 'cloud-download']}
        className="text-success mr-2"
      />
      <span className="text-success">{props.text || 'Download'}</span>
    </a>
  );

InspectionReportDownloadLink.propTypes = {
  link: PropTypes.string,
  text: PropTypes.string,
};
