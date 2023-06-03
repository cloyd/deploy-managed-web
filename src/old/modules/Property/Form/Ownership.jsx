import { FieldArray } from 'formik';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import * as Yup from 'yup';

import { fromPercent, toPercentAmount } from '../../../utils';
import { OwnershipRow } from './Ownership/OwnershipRow';
import { SecondaryOwners } from './Ownership/SecondaryOwners';

export const defaultPropsForPropertyOwnership = (props) => {
  return {
    ...props,
    percentageSplit: toPercentAmount(props.percentageSplit).toString(),
  };
};

export const validationSchemaForPropertyOwnership = {
  percentageSplit: Yup.number()
    .typeError('Must be a number')
    .required('Ownership share is required'),
};

export const formatPropertyOwnershipForSubmit = ({ ownership, owner }) => ({
  ...ownership,
  percentageSplit:
    owner && owner._destroy ? 0 : fromPercent(ownership.percentageSplit),
});

export const PropertyFormOwnership = ({
  isSoleOwnership,
  isShowOwnershipPercentage,
  primaryOwner,
  secondaryOwners,
  propertyOwnerships,
  values,
  touched,
  setFieldValue,
  isArchived,
}) => {
  values.totalSplitOfOwnership = propertyOwnerships.reduce(
    (memo, ownership, index) => {
      const percentage =
        index === 0 || !secondaryOwners[index - 1]._destroy
          ? fromPercent(ownership.percentageSplit)
          : 0;
      return memo + percentage;
    },
    0
  );
  touched.totalSplitOfOwnership = true;

  const maxOwnerId = Math.max(
    primaryOwner.id,
    ...secondaryOwners.map((o) => o.id)
  );

  return (
    <>
      <Row className="mt-5 mb-2">
        <Col xs="5">Owner Name</Col>
        {isShowOwnershipPercentage && !isSoleOwnership && (
          <Col xs="3">Ownership %</Col>
        )}
      </Row>
      <OwnershipRow
        isSoleOwnership={isSoleOwnership}
        isShowOwnershipPercentage={isShowOwnershipPercentage}
        owner={primaryOwner}
        ownership={propertyOwnerships[0]}
        index={0}
        name="propertyOwnerships"
        isArchived={isArchived}
      />
      <FieldArray name="secondaryOwners">
        {SecondaryOwners({
          isSoleOwnership,
          isShowOwnershipPercentage,
          propertyOwnerships,
          secondaryOwners,
          values,
          setFieldValue,
          maxOwnerId,
          isArchived,
        })}
      </FieldArray>
    </>
  );
};

PropertyFormOwnership.defaultProps = {
  primaryOwner: {},
  secondaryOwners: [],
  propertyOwnerships: [],
  touched: {},
};

PropertyFormOwnership.propTypes = {
  isSoleOwnership: PropTypes.bool,
  isShowOwnershipPercentage: PropTypes.bool,
  primaryOwner: PropTypes.object,
  secondaryOwners: PropTypes.array,
  propertyOwnerships: PropTypes.array,

  // hax - required to manipulate formik to enforce ownership adds up to 100%
  setFieldValue: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  isArchived: PropTypes.bool,
};
