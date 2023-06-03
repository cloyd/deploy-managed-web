import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../redux/profile';

class LogoutComponent extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(logoutUser());
  }

  render() {
    return <div />;
  }
}

export const Logout = connect()(LogoutComponent);
