import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Button, Card, FormGroup } from 'reactstrap';

import imageSrc from '@app/assets/tradies.png';
import { useIsOpen } from '@app/hooks';
import { FormLabel } from '@app/modules/Form';
import { ImageBackground } from '@app/modules/Image';
import { StepsCard, StepsCardBody, StepsCardFooter } from '@app/modules/Steps';
import { UserSearchSelect } from '@app/modules/User';
import {
  EXTERNAL_CREDITOR_CLASSIFICATIONS,
  USER_TYPES,
} from '@app/redux/users';

const WORKORDER_TEXT = {
  intro: `We'll send them the job and let you know if they're available.`,
  title: `Send this work order directly to your preferred tradie`,
  label: `Send work order to your preferred tradie on Managed or a previously used tradie in addition to quotes from the Marketplace`,
  submit: `Send work order`,
};

const QUOTE_TEXT = {
  intro: `We'll send them the job for quotes`,
  title: `Also get a quote from a preferred tradie`,
  label: `Get quotes from your preferred tradies on Managed or previously used tradies in addition to quotes from the Marketplace`,
  submit: `Get quotes`,
};

export const MarketplaceFormStepsCardTradies = ({
  isValid,
  isWorkOrder,
  onChange,
  onSubmit,
  propertyId,
}) => {
  const [isOpen, { handleOpen }] = useIsOpen(false);

  const content = useMemo(() => {
    if (isWorkOrder) {
      return WORKORDER_TEXT;
    } else {
      return QUOTE_TEXT;
    }
  }, [isWorkOrder]);

  return (
    <>
      <StepsCard className="text-center mb-3 pt-4">
        <h3 className="my-4">We&rsquo;ll find you some tradies</h3>
        <div className="bg-lavender text-center">
          <div className="px-4 pt-4">
            <FontAwesomeIcon
              icon={['fal', 'shop']}
              size="2x"
              className="text-primary mb-2"
            />
            <h5 className="text-primary">Managed Marketplace</h5>
            <p className="mb-0">
              There are many Managed approved tradies active in your area right
              now. {content.intro}.
            </p>
          </div>
          <ImageBackground
            src={imageSrc}
            className="mask-image-edges"
            style={{ height: '300px' }}
          />
        </div>
        {isOpen && (
          <div className="border-top mb-4">
            <StepsCardBody title={content.title}>
              <Card className="bg-lavender text-center p-4 mb-3 flex-row">
                <FontAwesomeIcon
                  icon={['fal', 'address-book']}
                  size="2x"
                  className="text-primary mt-1"
                />
                <FormGroup className="pl-3 mb-0">
                  <FormLabel
                    for="tradieIds"
                    className="text-normal text-left mb-3">
                    {content.label}. Leave blank to get responses from
                    Marketplace only.
                  </FormLabel>
                  <UserSearchSelect
                    name="tradieIds"
                    canSendInvite
                    isMulti={!isWorkOrder}
                    searchParams={{
                      perPage: 6,
                      classification: EXTERNAL_CREDITOR_CLASSIFICATIONS.tradie,
                      propertyId,
                    }}
                    type={USER_TYPES.externalCreditor}
                    onChange={onChange('tradieIds')}
                  />
                </FormGroup>
              </Card>
            </StepsCardBody>
          </div>
        )}
        <StepsCardFooter>
          <Button
            className="px-5"
            color="primary"
            size="lg"
            disabled={!isValid}
            onClick={onSubmit}>
            {content.submit}
          </Button>
        </StepsCardFooter>
      </StepsCard>
      {!isOpen && (
        <div className="text-center">
          <Button color="link" onClick={handleOpen}>
            {content.title}
          </Button>
        </div>
      )}
    </>
  );
};

MarketplaceFormStepsCardTradies.propTypes = {
  isValid: PropTypes.bool,
  isWorkOrder: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  propertyId: PropTypes.number,
};
