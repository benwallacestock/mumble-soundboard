import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { heading4FontSize } from '../../../styling/fonts';
import { spacing4, spacing5, spacing6 } from '../../../styling/spacing';
import { AuthenticationContext } from '../../authentication/context/AuthenticationContext';
import { User } from '../../authentication/context/AuthenticationProvider';
import { Button, ErrorButton } from '../../shared/Button';
import { auroraAlternate, auroraSuccess, snow } from '../../../styling/colours';
import { Switch } from '../../shared/Switch';
import { Modal } from '../../shared/Modal';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../../utils/api';
import { createToast } from '../../../utils/toast';

type UserRowProps = {
  user: User;
  updateUsers: () => void;
};

export const ManageUserRow = ({ user, updateUsers }: UserRowProps) => {
  const authenticationContext = useContext(AuthenticationContext);
  const [manageUserModalOpen, setManageUserModalOpen] = useState<boolean>(
    false
  );

  const setUserDisabled = (state: boolean) => {
    apiRequest<string>(
      'user/update/disabled',
      createRequestInit('POST', { id: user.id, state: state })
    )
      .then((response: string | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          createToast(response);
        }
      })
      .then(updateUsers);
  };

  const setUserAdmin = (state: boolean) => {
    apiRequest<string>(
      'user/update/admin',
      createRequestInit('POST', { id: user.id, state: state })
    )
      .then((response: string | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          createToast(response);
        }
      })
      .then(updateUsers);
  };

  const deleteUser = () => {
    apiRequest<string>('user', createRequestInit('DELETE', { id: user.id }))
      .then((response: string | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          createToast(response);
        }
      })
      .then(updateUsers);
  };

  return (
    <UserRowContainer>
      <Modal
        open={manageUserModalOpen}
        setOpen={setManageUserModalOpen}
        title={`Manage ${user.username}`}
      >
        <SwitchContainer>
          <SwitchLabel>Disabled</SwitchLabel>
          <Switch onChange={setUserDisabled} value={user.disabled} />
        </SwitchContainer>{' '}
        <SwitchContainer>
          <SwitchLabel>Admin</SwitchLabel>
          <Switch onChange={setUserAdmin} value={user.admin} />
        </SwitchContainer>
      </Modal>
      <UserLabel>
        <UserName isAdmin={user.admin} isDisabled={user.disabled}>
          {user.username}
        </UserName>
      </UserLabel>
      <ButtonRow>
        <Button type='button' onClick={() => setManageUserModalOpen(true)}>
          Manage
        </Button>
        <ErrorButton type='button' onClick={deleteUser}>
          Delete
        </ErrorButton>
      </ButtonRow>
    </UserRowContainer>
  );
};

const UserRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: ${spacing6};
`;

const UserLabel = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div<{ isAdmin: boolean; isDisabled: boolean }>`
  font-size: ${heading4FontSize};
  color: ${(props) =>
    props.isAdmin ? auroraAlternate : props.isDisabled ? snow : auroraSuccess};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: ${spacing4};
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${spacing5};
`;

const SwitchLabel = styled.div`
  margin-right: ${spacing4};
`;
