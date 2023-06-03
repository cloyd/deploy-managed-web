import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import UpcomingFeaturesComms from '../../../assets/images/upcoming-features-comms.webp';
import UpcomingFeatures from '../../../assets/images/upcoming-features.png';
import { Header } from '../../modules/Header';

export const UpcomingComponent = ({ title }) => (
  <>
    <Header title={title} />
    <Container className="wrapper h-100 d-flex justify-content-center align-items-center">
      <img
        className="mh-100 mw-100"
        src={
          title === 'Communications' ? UpcomingFeaturesComms : UpcomingFeatures
        }
      />
    </Container>
  </>
);

UpcomingComponent.propTypes = {
  title: PropTypes.string.isRequired,
};

export const Upcoming = connect()(UpcomingComponent);
