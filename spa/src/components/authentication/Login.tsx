import React, { useContext } from 'react';
import { Form, Formik } from 'formik';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';
import styled from 'styled-components';
import * as Yup from 'yup';
import { LoginDetails } from './context/AuthenticationProvider';
import { AuthenticationContext } from './context/AuthenticationContext';

const LoginDetailsSchema = Yup.object().shape({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const Login = () => {
  const initialValues: LoginDetails = { username: '', password: '' };
  const { login } = useContext(AuthenticationContext);

  return (
    <LoginContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={login}
        validationSchema={LoginDetailsSchema}
      >
        {(formProps) => (
          <LoginForm>
            <TextInput
              label={'Username'}
              name={'username'}
              formProps={formProps}
            />
            <TextInput
              label={'Password'}
              name={'password'}
              type={'password'}
              formProps={formProps}
            />
            <Button type='submit'>Login</Button>
          </LoginForm>
        )}
      </Formik>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;
