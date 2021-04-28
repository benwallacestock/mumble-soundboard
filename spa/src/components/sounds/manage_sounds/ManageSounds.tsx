import React, { useContext, useEffect, useState } from 'react';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../../utils/api';
import { ManageSoundRow } from './ManageSoundRow';
import styled from 'styled-components';
import { Switch } from '../../shared/Switch';
import { spacing4, spacing8 } from '../../../styling/spacing';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { AuthenticationContext } from '../../authentication/context/AuthenticationContext';

export type SoundData = {
  name: string;
  uuid: string;
  is_owner: boolean;
  owner_name: string;
  active: boolean;
  private: boolean;
};

export type Sounds = {
  sounds: Array<SoundData>;
};

export const ManageSounds = () => {
  const [sounds, setSounds] = useState<Sounds>();
  const [showPublic, setShowPublic] = useState<boolean>(true);

  useEffect(() => {
    updateSounds();
  }, []);

  const updateSounds = () => {
    apiRequest<Sounds>('sounds', createRequestInit('GET')).then(
      (response: Sounds | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, useContext(AuthenticationContext));
        } else {
          setSounds(response);
        }
      }
    );
  };

  if (!sounds) {
    return <LoadingSpinner />;
  }

  return (
    <ManageSoundsContainer>
      <ToggleContainer>
        <ToggleLabel>Show only my sounds </ToggleLabel>
        <Switch
          onChange={() => setShowPublic(!showPublic)}
          value={showPublic}
        />
      </ToggleContainer>

      {sounds.sounds
        .filter((sound) => !showPublic || sound.is_owner)
        .map((sound) => {
          return <ManageSoundRow sound={sound} updateSounds={updateSounds} />;
        })}
    </ManageSoundsContainer>
  );
};

const ManageSoundsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-bottom: ${spacing8};
`;

export const ToggleLabel = styled.div`
  margin-right: ${spacing4};
`;
