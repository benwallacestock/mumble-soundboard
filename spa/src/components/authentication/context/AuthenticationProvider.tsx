import React, { useEffect, useState } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  isApiRequestError,
} from '../../../utils/api';
import { toast } from 'react-toastify';
import { createToast, ToastType } from '../../../utils/toast';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { useHistory } from 'react-router-dom';

export type AuthenticationProps = {
  isAuthenticated: boolean;
  isDisabled: boolean;
  isAdmin: boolean;
};

type Props = {
  children: (authentication: AuthenticationProps) => React.ReactNode;
};

export type LoginDetails = {
  username: string;
  password: string;
};

export type SignUpDetails = {
  username: string;
  password: string;
  confirm_password: string;
};

export type User = {
  id: number;
  username: string;
  admin: boolean;
  disabled: boolean;
  mumble_username: string;
};

export const AuthenticationProvider = (props: Props) => {
  const [user, setCurrentUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (loginDetails: LoginDetails) => {
    setIsLoading(true);
    return apiRequest<User>(
      'login',
      createRequestInit<LoginDetails>('POST', loginDetails)
    ).then((response) => {
      console.log(response);
      if (isApiRequestError(response)) {
        createToast(response.statusText, ToastType.ERROR);
      } else {
        console.log(response);
        setCurrentUser(response);
        history.push('/');
      }
      setIsLoading(false);
    });
  };

  const signUp = (signupDetails: SignUpDetails) => {
    setIsLoading(true);
    apiRequest<User>(
      'signup',
      createRequestInit<LoginDetails>('POST', signupDetails)
    ).then((response) => {
      if (isApiRequestError(response)) {
        createToast(response.statusText, ToastType.ERROR);
      } else {
        setCurrentUser(response);
        history.push('/');
      }
      setIsLoading(false);
    });
  };

  const logout = () => {
    apiRequest('logout', createRequestInit('POST')).then((response) => {
      if (!isApiRequestError(response)) {
        setCurrentUser(undefined);
      }
    });
  };

  const getUser = () => {
    return user;
  };

  const refreshUser = () => {
    setIsLoading(true);
    apiRequest<User>('user/me', createRequestInit('GET')).then(
      (response: User | ApiRequestError) => {
        if (isApiRequestError(response)) {
          toast.error(response);
          setCurrentUser(undefined);
        } else {
          setCurrentUser(response);
        }
        setIsLoading(false);
      }
    );
  };

  const isAuthenticated = !!user;
  const isDisabled = !user || user.disabled;
  const isAdmin = !user || user.admin;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthenticationContext.Provider
      value={{ logout, login, signUp, getUser, refreshUser }}
    >
      {props.children({ isAuthenticated, isDisabled, isAdmin })}
    </AuthenticationContext.Provider>
  );
};
