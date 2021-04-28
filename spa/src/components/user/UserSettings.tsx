import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { spacing8 } from '../../styling/spacing';
import { AuthenticationContext } from '../authentication/context/AuthenticationContext';
import {
  apiRequest,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../utils/api';
import { createToast, ToastType } from '../../utils/toast';
import { LoadingSpinner } from '../shared/LoadingSpinner';

type ChangePasswordFormValues = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};

const ChangePasswordFormSchema = Yup.object().shape({
  old_password: Yup.string().required('Required'),
  new_password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters'),
  confirm_new_password: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
});

type ChangeMumbleUsernameFormValues = {
  mumble_username: string;
};

const ChangeMumbleUsernameFormSchema = Yup.object().shape({
  mumble_username: Yup.string()
    .required('Required')
    .max(128, 'Password must be at most 128 characters'),
});

export const UserSettings = () => {
  const authenticationContext = useContext(AuthenticationContext);
  const [loading, setLoading] = useState<boolean>(false);
  const initialPasswordFormValues: ChangePasswordFormValues = {
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  };

  const initialMumbleUsernameFormValues: ChangeMumbleUsernameFormValues = {
    mumble_username: authenticationContext.getUser()?.mumble_username || '',
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ManageUserContainer>
      <Formik
        initialValues={initialPasswordFormValues}
        onSubmit={(formData: ChangePasswordFormValues) => {
          setLoading(true);
          apiRequest<string>(
            'user/password',
            createRequestInit<ChangePasswordFormValues>('POST', formData)
          ).then((response) => {
            if (isApiRequestError(response)) {
              handleApiRequestError(response, authenticationContext);
            } else {
              createToast(response, ToastType.SUCCESS);
              authenticationContext.refreshUser();
            }
            setLoading(false);
          });
        }}
        validationSchema={ChangePasswordFormSchema}
      >
        {(formProps) => (
          <StyledForm>
            <TextInput
              label={'Old Password'}
              name={'old_password'}
              type={'password'}
              formProps={formProps}
            />
            <TextInput
              label={'New Password'}
              name={'new_password'}
              type={'password'}
              formProps={formProps}
            />
            <TextInput
              label={'Confirm New Password'}
              name={'confirm_new_password'}
              type={'password'}
              formProps={formProps}
            />
            <Button type='submit'>Change Password</Button>
          </StyledForm>
        )}
      </Formik>
      <Formik
        initialValues={initialMumbleUsernameFormValues}
        onSubmit={(formData: ChangeMumbleUsernameFormValues) => {
          setLoading(true);
          apiRequest<string>(
            'user/mumble_username',
            createRequestInit<ChangeMumbleUsernameFormValues>('POST', formData)
          ).then((response) => {
            if (isApiRequestError(response)) {
              handleApiRequestError(response, authenticationContext);
            } else {
              createToast(response, ToastType.SUCCESS);
              authenticationContext.refreshUser();
            }
            setLoading(false);
          });
        }}
        validationSchema={ChangeMumbleUsernameFormSchema}
      >
        {(formProps) => (
          <StyledForm>
            <TextInput
              label={'Mumble Username'}
              name={'mumble_username'}
              formProps={formProps}
            />
            <Button type='submit'>Change Mumble Username</Button>
          </StyledForm>
        )}
      </Formik>
    </ManageUserContainer>
  );
};

const ManageUserContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
  margin-bottom: ${spacing8};
`;
