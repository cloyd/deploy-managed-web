import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Container, Row } from 'reactstrap';

import { useIsOpen } from '../../../hooks';
import { CardLight } from '../../Card';
import { UserAvatar } from './Avatar';
import { UserAvatarEditor } from './Editor';

export const UserAvatarModule = (props) => {
  const { defaultImage, onDelete, onSubmit } = props;
  const [isEditing, actions] = useIsOpen(!defaultImage);

  return (
    <CardLight className={props.className} title="Avatar editor">
      {isEditing || !defaultImage ? (
        <UserAvatarEditor className="px-0" onSubmit={onSubmit} />
      ) : (
        <Container className="d-flex">
          <Row>
            <Col sm={4} className="text-center">
              <UserAvatar size={2} user={{ avatarUrl: defaultImage }} />
            </Col>
            <Col sm={8}>
              <div className="d-flex flex-column p-3">
                <Button
                  color="primary"
                  className="mb-2"
                  onClick={actions.handleOpen}>
                  Upload new avatar
                </Button>
                <Button color="danger" onClick={onDelete}>
                  Delete avatar
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </CardLight>
  );
};

UserAvatarModule.propTypes = {
  className: PropTypes.string,
  defaultImage: PropTypes.string,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
};

UserAvatarModule.defaultProps = {};
