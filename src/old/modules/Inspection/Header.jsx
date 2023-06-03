import PropTypes from 'prop-types';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { InspectionAreaUpdateName } from '.';
import { pathnameBack } from '../../utils';
import { ButtonIcon } from '../Button';
import { ImageBackground } from '../Image';
import { Link } from '../Link';

export const InspectionHeader = ({
  backgroundImage,
  backText,
  isLoading,
  name,
  onUpdateArea,
  pathname,
}) => {
  const iconColor = backgroundImage ? 'white' : 'primary';
  const textStyle = backgroundImage
    ? { color: '#fff', textShadow: '1px 1px #666666' }
    : {};

  return (
    <ImageBackground src={backgroundImage} style={textStyle}>
      <div
        className="d-flex border-bottom overflow-hidden pt-3"
        data-testid="inspection-header"
        style={{
          height: '214px',
          backgroundColor: backgroundImage ? 'rgba(0,0,0,0.3)' : null,
        }}>
        {name && (
          <Container className="pt-3 pt-sm-5">
            <Row>
              <Col xs={12} className="mb-2">
                {pathname && (
                  <Link to={pathnameBack(pathname)}>
                    <ButtonIcon
                      color={iconColor}
                      className="p-0 text-left"
                      icon={['far', 'chevron-left']}
                      style={textStyle}>
                      <span className={`text-${iconColor}`}>{backText}</span>
                    </ButtonIcon>
                  </Link>
                )}
              </Col>
              <Col md={8} lg={6}>
                <InspectionAreaUpdateName
                  iconColor={iconColor}
                  isLoading={isLoading}
                  name={name}
                  onUpdateArea={onUpdateArea}>
                  <h2
                    className="pt-1"
                    data-testid="inspection-area-name"
                    style={textStyle}>
                    {name.length >= 48 ? `${name.substring(0, 48)}...` : name}
                  </h2>
                </InspectionAreaUpdateName>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </ImageBackground>
  );
};

InspectionHeader.propTypes = {
  backgroundImage: PropTypes.string,
  backText: PropTypes.string,
  isLoading: PropTypes.bool,
  name: PropTypes.string,
  onUpdateArea: PropTypes.func,
  pathname: PropTypes.string,
};

InspectionHeader.defaultProps = {
  backText: 'Back to Condition',
};
