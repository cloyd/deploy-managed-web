import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { pathnameBack, pathnameUpdateSlug } from '../../utils';
import { Link } from '../Link';

export const NavPrevAndNext = (props) => {
  const { className, nextSlug, pathname, prevSlug, textBack } = props;

  return (
    <Container className={className}>
      <Row>
        <Col xs={6} className="text-left">
          {prevSlug ? (
            <Link
              className="btn btn-link"
              data-testid="link-prev-area"
              to={pathnameUpdateSlug(pathname, prevSlug)}>
              <FontAwesomeIcon icon={['far', 'chevron-left']} />{' '}
              <span className="ml-1">Previous area</span>
            </Link>
          ) : (
            <span className="text-muted">
              <FontAwesomeIcon icon={['far', 'chevron-left']} />{' '}
              <span className="ml-1">Previous area</span>
            </span>
          )}
        </Col>
        <Col xs={6} className="text-right">
          {nextSlug ? (
            <Link
              className="btn btn-link"
              data-testid="link-next-area"
              to={pathnameUpdateSlug(pathname, nextSlug)}>
              <span className="mr-1">Next area</span>{' '}
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </Link>
          ) : (
            <Link className="btn btn-link" to={pathnameBack(pathname)}>
              <span className="mr-1">{textBack}</span>{' '}
              <FontAwesomeIcon icon={['far', 'chevron-right']} />
            </Link>
          )}
        </Col>
      </Row>
    </Container>
  );
};

NavPrevAndNext.propTypes = {
  textBack: PropTypes.string,
  className: PropTypes.string,
  nextSlug: PropTypes.number,
  pathname: PropTypes.string,
  prevSlug: PropTypes.number,
};

NavPrevAndNext.defaultProps = {
  textBack: 'Back',
};
