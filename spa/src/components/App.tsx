import * as React from 'react';
import { GlobalStyle } from '../styling/GlobalStyle';
import { AuthenticationProvider } from './authentication/context/AuthenticationProvider';
import { Home } from './home/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteProps,
  Redirect,
} from 'react-router-dom';
import { NavMenu } from './NavMenu';
import { UploadSound } from './sounds/UploadSound';
import { ManageSounds } from './sounds/manage_sounds/ManageSounds';
import { StyledToastContainer } from '../utils/toast';
import { Login } from './authentication/Login';
import { SignUp } from './authentication/SignUp';
import { UserSettings } from './user/UserSettings';
import { ManageUsers } from './user/manage_users/ManageUsers';

export type CustomRouteProps = {
  isAuthenticated: boolean;
  adminRequired?: boolean;
  isAdmin?: boolean;
} & RouteProps;

function ProtectedRoute({
  isAuthenticated,
  adminRequired,
  isAdmin,
  ...routeProps
}: CustomRouteProps) {
  if (isAuthenticated) {
    if (adminRequired && !isAdmin) {
      return <Redirect to={{ pathname: '/' }} />;
    } else {
      return <Route {...routeProps} />;
    }
  } else {
    return <Redirect to={{ pathname: 'login' }} />;
  }
}

function UnprotectedRoute({
  isAuthenticated,
  ...routeProps
}: CustomRouteProps) {
  if (!isAuthenticated) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to={{ pathname: '/' }} />;
  }
}

export const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <StyledToastContainer limit={5} autoClose={3000} />
      <AuthenticationProvider>
        {({ isAuthenticated, isDisabled, isAdmin }) => (
          <>
            <NavMenu
              isAuthenticated={isAuthenticated}
              isDisabled={isDisabled}
              isAdmin={isAdmin}
            />
            {isAuthenticated && isDisabled && !isAdmin ? (
              <p>Your account is disabled</p>
            ) : (
              <Switch>
                <UnprotectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/login'
                  component={Login}
                />{' '}
                <UnprotectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/signup'
                  component={SignUp}
                />
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/upload'
                  component={UploadSound}
                />
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/sounds'
                  component={ManageSounds}
                />
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/user'
                  component={UserSettings}
                />
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  adminRequired={true}
                  isAdmin={isAdmin}
                  path='/admin'
                  component={ManageUsers}
                />
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  path='/'
                  component={Home}
                />
              </Switch>
            )}
          </>
        )}
      </AuthenticationProvider>
    </Router>
  );
};
