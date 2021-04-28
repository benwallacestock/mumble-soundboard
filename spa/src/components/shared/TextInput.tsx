import React from 'react';
import styled from 'styled-components';
import { spacing2, spacing4, spacing5 } from '../../styling/spacing';
import { auroraError, polar, polarLight, snow } from '../../styling/colours';
import { FormikProps } from 'formik';
import { get } from 'lodash';
import { displayError } from '../../utils/form';
import { microText } from '../../styling/fonts';

export type TextInputProps<FormValues> = {
  type: 'text' | 'password' | 'email';
  label: string;
  name: string;
  formProps: FormikProps<FormValues>;
};

export const TextInput = <FormValues,>(props: TextInputProps<FormValues>) => {
  const error = displayError(props.formProps, props.name);
  return (
    <TextInputContainer>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledInput
        type={props.type}
        name={props.name}
        error={error}
        onChange={props.formProps.handleChange}
        value={get(props.formProps.values, props.name)}
        onBlur={props.formProps.handleBlur}
      />
      <ErrorText visible={error}>
        {get(props.formProps.errors, props.name)}
      </ErrorText>
    </TextInputContainer>
  );
};

TextInput.defaultProps = {
  type: 'text',
};

const TextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing4};
  width: 100%;
`;

const StyledLabel = styled.label`
  margin-bottom: ${spacing2};
`;

const StyledInput = styled.input<{ error: boolean }>`
  border: ${(props) => (props.error ? auroraError : polarLight)} solid 2px;
  border-radius: 5px;
  padding: ${spacing2};
  background-color: ${polar};
  color: ${snow};
  outline: none;
`;

export const ErrorText = styled.div<{ visible: boolean }>`
  height: ${spacing5};
  display: flex;
  align-items: flex-end;
  font-size: ${microText};
  color: ${auroraError};
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;
