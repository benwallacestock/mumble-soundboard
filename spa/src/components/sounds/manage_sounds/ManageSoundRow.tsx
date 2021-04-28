import React, { useContext, useState } from 'react';
import { SoundData, ToggleLabel } from './ManageSounds';
import { Switch } from '../../shared/Switch';
import styled from 'styled-components';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../../utils/api';
import { heading4FontSize, heading5FontSize } from '../../../styling/fonts';
import { spacing4, spacing6 } from '../../../styling/spacing';
import { Modal } from '../../shared/Modal';
import { Button, ErrorButton } from '../../shared/Button';
import { TextInput } from '../../shared/TextInput';
import { Form, Formik } from 'formik';
import { PrivateToggleContainer } from '../UploadSound';
import { createToast } from '../../../utils/toast';
import { frostPrimary, snow } from '../../../styling/colours';
import { AuthenticationContext } from '../../authentication/context/AuthenticationContext';

type SoundRowProps = {
  sound: SoundData;
  updateSounds: () => void;
};

type EditSoundForm = {
  name: string;
  private: boolean;
  uuid: string;
};

export const ManageSoundRow = ({ sound, updateSounds }: SoundRowProps) => {
  const [manageSoundModalOpen, setManageSoundModalOpen] = useState<boolean>(
    false
  );
  const authenticationContext = useContext(AuthenticationContext);

  const updateSoundboard = (state: boolean) => {
    apiRequest<string>(
      'soundboard',
      createRequestInit('PUT', { uuid: sound.uuid, state: state })
    )
      .then((response: string | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          createToast(response);
        }
      })
      .then(updateSounds);
  };

  const deleteSound = () => {
    apiRequest<string>(
      'sound',
      createRequestInit('DELETE', { uuid: sound.uuid })
    )
      .then((response: string | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          createToast(response);
          setManageSoundModalOpen(false);
        }
      })
      .then(updateSounds);
  };

  const editSoundInitialValues: EditSoundForm = {
    name: sound.name,
    private: sound.private,
    uuid: sound.uuid,
  };

  return (
    <SoundRowContainer>
      <Modal open={manageSoundModalOpen} setOpen={setManageSoundModalOpen}>
        <Formik
          initialValues={editSoundInitialValues}
          onSubmit={(values: EditSoundForm) => {
            apiRequest<string>(
              'sound',
              createRequestInit<EditSoundForm>('PUT', values)
            )
              .then((response) => {
                if (isApiRequestError(response)) {
                  handleApiRequestError(response, authenticationContext);
                } else {
                  createToast(response);
                  setManageSoundModalOpen(false);
                }
              })
              .then(updateSounds);
          }}
        >
          {(formProps) => (
            <Form>
              <TextInput label='Name' name='name' formProps={formProps} />
              <PrivateToggleContainer>
                <ToggleLabel>Make this sound private</ToggleLabel>
                <Switch
                  onChange={(value) =>
                    formProps.setFieldValue('private', value)
                  }
                  value={formProps.values.private}
                />
              </PrivateToggleContainer>

              <ButtonRow>
                <Button type='submit'>Edit</Button>
                <ErrorButton type='button' onClick={deleteSound}>
                  Delete
                </ErrorButton>
              </ButtonRow>
            </Form>
          )}
        </Formik>
      </Modal>
      <SoundLabel
        clickable={sound.is_owner}
        onClick={() => sound.is_owner && setManageSoundModalOpen(true)}
      >
        <SoundName>{sound.name}</SoundName>
        <SoundOwner>{sound.owner_name}</SoundOwner>
      </SoundLabel>

      <Switch
        onChange={(value) => updateSoundboard(value)}
        value={sound.active}
      />
    </SoundRowContainer>
  );
};

const SoundRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: ${spacing6};
`;

const SoundLabel = styled.div<{ clickable: boolean }>`
  margin-right: auto;
  display: flex;
  flex-direction: column;
  color: ${(props) => (props.clickable ? frostPrimary : snow)};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};

  &:hover {
    text-decoration: ${(props) => (props.clickable ? 'underline' : 'none')};
  }
`;

const SoundName = styled.div`
  font-size: ${heading4FontSize};
`;
const SoundOwner = styled.div`
  font-size: ${heading5FontSize};
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: ${spacing4};
  }
`;
