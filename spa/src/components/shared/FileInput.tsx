import React, { useState } from 'react';
import styled from 'styled-components';
import { spacing2, spacing4 } from '../../styling/spacing';
import { Button } from './Button';
import { FormikProps } from 'formik';
import { get } from 'lodash';
import { ErrorText } from './TextInput';
import { displayError } from '../../utils/form';

export type FileInputProps<FormValues extends Record<string, any>> = {
  label: string;
  name: string;
  formProps: FormikProps<FormValues>;
};

export const FileInput = <FormValues extends Record<string, any>>(
  props: FileInputProps<FormValues>
) => {
  const [fileName, setFileName] = useState<string>('Upload a file');

  let hiddenFileInput: HTMLInputElement | null = null;

  const uploadButtonClick = () => {
    hiddenFileInput?.click();
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.formProps.setFieldValue(
      props.name,
      (e.target as HTMLInputElement).files?.[0]
    );
    setFileName(
      (e.target as HTMLInputElement).files?.[0].name || 'UploadSound a file'
    );
    props.formProps.validateForm().then(() => {
      props.formProps.setFieldTouched(props.name, true);
    });
  };
  const error = displayError(props.formProps, props.name);

  return (
    <FileInputContainer>
      <StyledLabel>{props.label}</StyledLabel>

      <Row>
        <Button onClick={uploadButtonClick} type='button'>
          Upload
        </Button>
        <FileName>{fileName}</FileName>
      </Row>

      <ErrorText visible={error}>
        {get(props.formProps.errors, props.name)}
      </ErrorText>

      <HiddenInput
        type='file'
        ref={(ref) => {
          hiddenFileInput = ref;
        }}
        onChange={onChange}
      />
    </FileInputContainer>
  );
};

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${spacing4};
  width: 100%;
`;

const FileName = styled.p`
  margin: 0 0 0 ${spacing4};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
  margin-bottom: ${spacing2};
`;

const HiddenInput = styled.input`
  display: none;
`;
