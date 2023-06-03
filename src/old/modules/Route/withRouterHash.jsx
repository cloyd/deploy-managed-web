import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

export const withRouterHash = (WrappedComponent, config = {}) => {
  const displayName = (c) => c.displayName || c.name || 'Component';

  class WithRouterHash extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      match: PropTypes.object.isRequired,
    };

    static displayName = `WithOnComplete(${displayName(WrappedComponent)})`;

    state = {
      hasScrolled: false,
    };

    componentDidUpdate(prevProps) {
      if (!this.props.location.hash) {
        return;
      }

      const el = document.getElementById(
        this.props.location.hash.replace('#', '')
      );

      if (el && !this.state.hasScrolled) {
        this.setState({ hasScrolled: true }, () => {
          const offset =
            config.offset ||
            document.getElementById('navigation-main').offsetHeight + 50;

          el.scrollIntoView(true);
          setTimeout(() => window.scrollBy(0, -offset), 500);
        });
      }
    }

    render() {
      const { history, location, match, ...props } = this.props;
      return <WrappedComponent {...props} />;
    }
  }

  return withRouter(WithRouterHash);
};
