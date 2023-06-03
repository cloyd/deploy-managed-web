import PropTypes from 'prop-types';
import React, { useCallback, useContext } from 'react';
import { Button } from 'reactstrap';

import { SearchSelectContext } from './SearchSelectContext';

/**
 * Button that toggles open the Invite a Tradie modal
 */
export const ButtonInvite = (props) => {
  const { onClick } = props;
  const context = useContext(SearchSelectContext);

  const handleClick = useCallback(() => {
    onClick && onClick();
    context.inviteModal.handleOpen();
  }, [context.inviteModal, onClick]);

  return (
    <Button className="p-0" color="link" tabIndex="0" onClick={handleClick}>
      {context.options?.length > 0
        ? 'Invite a tradie'
        : 'No results found - invite a tradie?'}
    </Button>
  );
};

ButtonInvite.propTypes = {
  onClick: PropTypes.func,
};
