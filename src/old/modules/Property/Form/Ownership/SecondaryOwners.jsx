import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import { Button, Col, Row } from "reactstrap";

import { getDeleteItemText } from "../../../../utils";
import { ModalDeleteItem } from "../../../Modal";

import { NewOwnerRow } from "./NewOwnerRow";
import { OwnershipRow } from "./OwnershipRow";
import { TotalSharesSummaryRow } from "./TotalSharesSummaryRow";

const SecondaryOwnersComponent = ({
  isSoleOwnership,
  isShowOwnershipPercentage,
  propertyOwnerships,
  secondaryOwners,
  values,
  setFieldValue,
  maxOwnerId,
  arrayHelpers,
  isArchived,
}) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [index, setIndex] = useState();
  const [owner, setOwner] = useState({ firstName: "", lastName: "" });

  const handleAddSecondaryOwner = useCallback(() => {
    arrayHelpers.push({
      id: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
  }, [arrayHelpers]);

  const isOwnerPersisted = useCallback((owner) => !!owner.id, []);

  const handleRemoveSecondaryOwner = useCallback(() => {
    if (isOwnerPersisted(owner)) {
      arrayHelpers.replace(index, {
        ...owner,
        _destroy: 1,
      });
    } else {
      arrayHelpers.remove(index);
    }

    setFieldValue("totalSplitOfOwnership", 0); // hax: trigger re-render to re-calculate total
    setIsShowDeleteModal(false);
  }, [isOwnerPersisted, owner, setFieldValue, arrayHelpers, index]);

  const rows = useMemo(() => {
    let rows = secondaryOwners.map((owner, index) => ({
      index,
      propertyOwnershipsIndex: index + 1,
      owner,
      ownership: propertyOwnerships[index + 1],
    }));

    if (isShowOwnershipPercentage && !isSoleOwnership) {
      const newOwnerRowIndex = secondaryOwners.findIndex(
        (owner) => !isOwnerPersisted(owner)
      );

      if (newOwnerRowIndex === -1) {
        rows.push({ type: "TotalSharesSummaryRow" });
      } else {
        rows.splice(newOwnerRowIndex, 0, { type: "TotalSharesSummaryRow" });
      }
    }

    return rows;
  }, [
    secondaryOwners,
    isShowOwnershipPercentage,
    isSoleOwnership,
    propertyOwnerships,
    isOwnerPersisted,
  ]);

  const handleShowDeleteModal = useCallback(
    (index, owner) => () => {
      setIsShowDeleteModal(!isShowDeleteModal);
      if (index !== undefined) {
        setIndex(index);
        setOwner(owner);
      }
    },
    [isShowDeleteModal]
  );

  return (
    <>
      {rows.map(({ index, owner, ownership, type, propertyOwnershipsIndex }) =>
        type === "TotalSharesSummaryRow" ? (
          <TotalSharesSummaryRow
            key={type}
            name="totalSplitOfOwnership"
            values={values}
          />
        ) : isOwnerPersisted(owner) ? (
          <OwnershipRow
            key={owner.id}
            name="propertyOwnerships"
            owner={owner}
            ownership={ownership}
            index={propertyOwnershipsIndex}
            isSoleOwnership={isSoleOwnership}
            isShowOwnershipPercentage={isShowOwnershipPercentage}
            onRemove={handleShowDeleteModal(index, owner)}
            isArchived={isArchived}
          />
        ) : (
          <NewOwnerRow
            key={maxOwnerId + index}
            name="secondaryOwners"
            index={index}
            onRemove={handleShowDeleteModal(index, owner)}
            isArchived={isArchived}
            setFieldValue={setFieldValue}
          />
        )
      )}
      <Row>
        <Col>
          <Button
            color="primary"
            onClick={handleAddSecondaryOwner}
            disabled={isArchived}
          >
            Add an Owner
          </Button>
        </Col>
      </Row>
      <ModalDeleteItem
        size="md"
        isOpen={isShowDeleteModal}
        title="Are you sure?"
        bodyText={getDeleteItemText(owner, "owner", "property")}
        onSubmit={handleRemoveSecondaryOwner}
        onCancel={handleShowDeleteModal()}
      />
    </>
  );
};

SecondaryOwnersComponent.propTypes = {
  isSoleOwnership: PropTypes.bool,
  isShowOwnershipPercentage: PropTypes.bool,
  propertyOwnerships: PropTypes.array,
  secondaryOwners: PropTypes.array,
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  maxOwnerId: PropTypes.number,
  arrayHelpers: PropTypes.object,
  isArchived: PropTypes.bool,
};

export const SecondaryOwners = ({
  isSoleOwnership,
  isShowOwnershipPercentage,
  propertyOwnerships,
  secondaryOwners,
  values,
  setFieldValue,
  maxOwnerId,
  isArchived,
}) =>
  Object.assign(
    (arrayHelpers) => (
      <SecondaryOwnersComponent
        isSoleOwnership={isSoleOwnership}
        isShowOwnershipPercentage={isShowOwnershipPercentage}
        propertyOwnerships={propertyOwnerships}
        secondaryOwners={secondaryOwners}
        values={values}
        setFieldValue={setFieldValue}
        maxOwnerId={maxOwnerId}
        arrayHelpers={arrayHelpers}
        isArchived={isArchived}
      />
    ),
    { displayName: "SecondaryOwners" }
  );
