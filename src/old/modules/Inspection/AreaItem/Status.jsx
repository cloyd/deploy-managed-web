import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';

export const InspectionAreaItemStatus = ({ item }) => (
  <Row>
    <Col sm={4}>
      <ItemStatus title="clean" isChecked={item?.isClean} />
    </Col>
    <Col sm={4}>
      <ItemStatus title="undamaged" isChecked={item?.isUndamaged} />
    </Col>
    <Col sm={4}>
      <ItemStatus title="working" isChecked={item?.isWorking} />
    </Col>
  </Row>
);

InspectionAreaItemStatus.propTypes = {
  item: PropTypes.shape({
    isClean: PropTypes.bool,
    isUndamaged: PropTypes.bool,
    isWorking: PropTypes.bool,
  }),
};

const ItemStatus = ({ isChecked, title }) =>
  isChecked === true || isChecked === 'true' ? (
    <>
      <span
        className="text-success d-none d-md-inline-block"
        title={`Is ${title}`}>
        Y
      </span>
      <span className="d-md-none ml-2">Is {title}</span>
    </>
  ) : isChecked === false || isChecked === 'false' ? (
    <>
      <span
        className="text-danger d-none d-md-inline-block"
        title={`Is not ${title}`}>
        N
      </span>
      <span className="d-md-none ml-2">Is not {title}</span>
    </>
  ) : (
    <span>-</span>
  );

ItemStatus.propTypes = {
  isChecked: PropTypes.bool,
  title: PropTypes.string.isRequired,
};
