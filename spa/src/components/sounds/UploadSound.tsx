import React, { useContext, useState } from 'react';
import { TextInput } from '../shared/TextInput';
import styled from 'styled-components';
import { Button } from '../shared/Button';
import { Form, Formik } from 'formik';
import { FileInput } from '../shared/FileInput';
import {
  apiRequest,
  createFormDataRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../utils/api';
import { Switch } from '../shared/Switch';
import { spacing4, spacing5 } from '../../styling/spacing';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthenticationContext } from '../authentication/context/AuthenticationContext';
import { createToast, ToastType } from '../../utils/toast';

type CreateSoundForm = {
  audio: File | null;
  name: string;
  private: boolean;
};

const CreateSoundSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required')
    .max(20, 'Name must be at most 20 characters'),
  audio: Yup.mixed()
    .test('required', 'Required', (file) => {
      return !!file;
    })
    .test(
      'fileFormat',
      'Only audio files',
      (file) => file && file.type.match('audio.*')
    )
    .test(
      'fileSize',
      'Maximum file size of 1MB exceeded',
      (file) => file && file.size < 1024 * 1024
    ),
});

export const UploadSound = () => {
  const initialValues: CreateSoundForm = {
    name: '',
    audio: null,
    private: false,
  };

  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const authenticationContext = useContext(AuthenticationContext);
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <UploadContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={CreateSoundSchema}
        onSubmit={(values: CreateSoundForm) => {
          setLoading(true);
          const formData = new FormData();
          if (values.audio) {
            formData.append('file', values.audio);
          }
          formData.append('data', JSON.stringify(values));
          apiRequest<string>(
            'sound',
            createFormDataRequestInit('POST', formData)
          ).then((response) => {
            if (isApiRequestError(response)) {
              handleApiRequestError(response, authenticationContext);
            } else {
              createToast('Sound created successfully', ToastType.SUCCESS);
              history.push('/sounds');
            }
            setLoading(false);
          });
        }}
      >
        {(formProps) => (
          <UploadForm>
            <TextInput label='Name' name='name' formProps={formProps} />
            <FileInput
              label='Audio File'
              name={'audio'}
              formProps={formProps}
            />
            <PrivateToggleContainer>
              <ToggleLabel>Make this sound private</ToggleLabel>
              <Switch
                onChange={(value) => formProps.setFieldValue('private', value)}
                value={formProps.values.private}
              />
            </PrivateToggleContainer>

            <Button type='submit'>Submit</Button>
          </UploadForm>
        )}
      </Formik>
    </UploadContainer>
  );
};

const UploadContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
`;

const UploadForm = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
`;

export const PrivateToggleContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${spacing5};
`;

const ToggleLabel = styled.div`
  margin-right: ${spacing4};
`;
