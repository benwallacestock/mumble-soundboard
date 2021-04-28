import { Form, Formik } from 'formik';
import { TextInput } from '../shared/TextInput';
import { Button } from '../shared/Button';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { SignUpDetails } from './context/AuthenticationProvider';
import { AuthenticationContext } from './context/AuthenticationContext';
import * as Yup from 'yup';

const SignUpDetailsSchema = Yup.object().shape({
  username: Yup.string()
    .required('Required')
    .max(64, 'Username must be at most 20 characters'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters'),
  confirm_password: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
});

export const SignUp = () => {
  const initialValues: SignUpDetails = {
    username: '',
    password: '',
    confirm_password: '',
  };
  const { signUp } = useContext(AuthenticationContext);
  return (
    <SignUpContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={signUp}
        validationSchema={SignUpDetailsSchema}
      >
        {(formProps) => (
          <SignUpForm>
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
            <TextInput
              label={'Confirm Password'}
              name={'confirm_password'}
              type={'password'}
              formProps={formProps}
            />
            <Button type='submit'>Signup</Button>
          </SignUpForm>
        )}
      </Formik>
    </SignUpContainer>
  );
};

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SignUpForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;
