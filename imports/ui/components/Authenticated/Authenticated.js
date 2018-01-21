import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import VerifyCodeAndLogin from '../VerifyCodeAndLogin/VerifyCodeAndLogin';

const Authenticated = ({
  loggingIn, loading, user, authenticated, component, path, exact, ...rest
}) => (
  <Route
    path={path}
    exact={exact}
    render={(props) => {
      if (loading) {
        return <div />;
      }

      if (!authenticated) {
        return <Redirect to="/login" />;
      }

      /**
       * At most one login token will be sent to the client,
       * so we check the first index in the login token array
       */
      if (!user.services.resume.loginTokens[0].verified) {
        return <VerifyCodeAndLogin />;
      }

      return React.createElement(component, {
        ...props, ...rest, loggingIn, authenticated,
      });
    }}
  />
);

Authenticated.defaultProps = {
  path: '',
  exact: false,
  user: {},
};

Authenticated.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  user: PropTypes.object,
  path: PropTypes.string,
  exact: PropTypes.bool,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('users.checkAuthenticationStatus');
  const loading = !subscription.ready();
  const user = Meteor.user();

  return {
    loading,
    user,
  };
})(Authenticated);
