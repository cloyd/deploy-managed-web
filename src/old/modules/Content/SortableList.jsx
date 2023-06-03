import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { CardBody, CardHeader, Col, Row } from 'reactstrap';

import { toClassName } from '../../utils';
import { ButtonIcon } from '../Button';
import { CardLight } from '../Card';

export const ContentSortableList = (props) => {
  const { items, onUpdate } = props;
  const [selectedItemId, setSelectedItemId] = useState();

  const handleClick = useCallback(
    (id, position) => (e) => {
      e.preventDefault();
      setSelectedItemId(id);
      onUpdate && onUpdate({ id, position });
      e.stopPropagation();
    },
    [onUpdate]
  );

  return (
    <CardLight
      className={toClassName(['border-0'], props.className)}
      data-testid="card-sortable-list">
      <CardHeader className="d-none d-md-block">
        <Row className="no-gutters font-weight-bold">
          <Col md={1}>#</Col>
          <Col md={7}>Item name</Col>
          <Col md={4} className="text-right">
            Actions
          </Col>
        </Row>
      </CardHeader>
      {items?.length > 0 ? (
        <CardBody>
          {items.map((item) => (
            <div
              className="d-block"
              data-testid="sortable-item"
              key={`sort-item-${item.id}`}>
              <Row
                className={toClassName(
                  ['py-3 border-bottom'],
                  selectedItemId === item.id ? 'bg-light' : ''
                )}>
                <Col md={1}>#{item.position}</Col>
                <Col md={7}>{item.name || item.title}</Col>
                <Col md={4} className="text-right">
                  {item.position > 1 && (
                    <ButtonIcon
                      data-testid="button-top"
                      icon={['far', 'chevron-double-up']}
                      title="Move to top"
                      onClick={handleClick(item.id, 1)}
                    />
                  )}
                  {item.position < items.length && (
                    <ButtonIcon
                      data-testid="button-bottom"
                      icon={['far', 'chevron-double-down']}
                      title="Move to bottom"
                      onClick={handleClick(item.id, items.length)}
                    />
                  )}
                  {item.position > 1 && (
                    <ButtonIcon
                      data-testid="button-up"
                      icon={['far', 'chevron-up']}
                      title="Move up"
                      onClick={handleClick(item.id, item.position - 1)}
                    />
                  )}
                  {item.position < items.length && (
                    <ButtonIcon
                      data-testid="button-down"
                      icon={['far', 'chevron-down']}
                      title="Move down"
                      onClick={handleClick(item.id, item.position + 1)}
                    />
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </CardBody>
      ) : (
        <CardBody>
          <p className="mb-0">No items found in this area</p>
        </CardBody>
      )}
    </CardLight>
  );
};

ContentSortableList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      position: PropTypes.number,
      title: PropTypes.string,
    })
  ),
  onUpdate: PropTypes.func,
};
