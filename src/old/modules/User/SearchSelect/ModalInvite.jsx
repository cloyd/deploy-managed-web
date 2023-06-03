import React, { useContext } from 'react';
import { Alert } from 'reactstrap';

import { MarketplaceFormInviteTradie } from '../../Marketplace';
import { ModalConfirm } from '../../Modal';
import { OptionItem } from './OptionItem';
import { SearchSelectContext } from './SearchSelectContext';

/**
 * Invite a Tradie modal
 */
export const ModalInvite = () => {
  const context = useContext(SearchSelectContext);

  return (
    <ModalConfirm
      isOpen={context.inviteModal.show}
      size="lg"
      tabIndex="0"
      title="Add a tradie">
      <MarketplaceFormInviteTradie
        hasError={false}
        isLoading={context.isLoadingTradieInvite}
        search={context.search}
        onCancel={context.inviteModal.handleClose}
        onComplete={
          !context.errorInvitedTradie ? context.inviteModal.handleClose : null
        }
        onSubmit={context.handleSendInvite}>
        {context.errorInvitedTradie && (
          <Alert color="warning">
            <h5>This tradie is already in our Marketplace</h5>
            <p>Click here to select</p>
            <OptionItem
              className="border rounded mt-3 bg-white"
              isDisabled={context.selectedIds.some(
                (id) => id === context.errorInvitedTradie.id
              )}
              option={context.errorInvitedTradie}
              onClick={context.handleClickOption}
            />
          </Alert>
        )}
      </MarketplaceFormInviteTradie>
    </ModalConfirm>
  );
};
