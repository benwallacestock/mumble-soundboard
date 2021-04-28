import { createContext } from 'react';
import { LoginDetails, SignUpDetails, User } from './AuthenticationProvider';

export type AuthenticationContextValue = {
  logout: () => void;
  login: (loginDetails: LoginDetails) => void;
  signUp: (signUpDetails: SignUpDetails) => void;
  getUser: () => User | undefined;
  refreshUser: () => void;
};

const throwError = () => {
  throw new Error('Authentication Context has not been initialised yet!');
};

export const AuthenticationContext = createContext<AuthenticationContextValue>({
  logout: throwError,
  login: throwError,
  signUp: throwError,
  getUser: throwError,
  refreshUser: throwError,
});
