import React, { useContext, useEffect, useState } from 'react';
import { User } from '../../authentication/context/AuthenticationProvider';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../../utils/api';
import { AuthenticationContext } from '../../authentication/context/AuthenticationContext';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { ManageUserRow } from './ManageUserRow';
import styled from 'styled-components';
import { sortBy } from 'lodash';

export type Users = {
  users: Array<User>;
};

export const ManageUsers = () => {
  const [users, setUsers] = useState<Users>();

  useEffect(() => {
    updateUsers();
  }, []);

  const updateUsers = () => {
    apiRequest<Users>('users', createRequestInit('GET')).then(
      (response: Users | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, useContext(AuthenticationContext));
        } else {
          setUsers(response);
        }
      }
    );
  };

  if (!users) {
    return <LoadingSpinner />;
  }

  return (
    <ManageUsersContainer>
      {sortBy(users.users, (u) => u.id).map((user) => {
        return (
          <ManageUserRow updateUsers={updateUsers} user={user} key={user.id} />
        );
      })}
    </ManageUsersContainer>
  );
};
const ManageUsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
