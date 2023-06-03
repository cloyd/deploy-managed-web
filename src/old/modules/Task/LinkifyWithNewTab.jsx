import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Linkify from 'react-linkify';

export const LinkifyWithNewTab = (props) => {
  const componentDecorator = useCallback(
    (href, text, key) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
    []
  );

  return (
    <Linkify componentDecorator={componentDecorator}>
      <p style={{ whiteSpace: 'pre-line' }}>{props.linkifyText}</p>
    </Linkify>
  );
};

LinkifyWithNewTab.defaultProps = {
  linkifyText: '',
};

LinkifyWithNewTab.propTypes = {
  linkifyText: PropTypes.string,
};
