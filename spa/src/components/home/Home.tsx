import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../authentication/context/AuthenticationContext';
import {
  apiRequest,
  ApiRequestError,
  createRequestInit,
  handleApiRequestError,
  isApiRequestError,
} from '../../utils/api';
import styled from 'styled-components';
import { Sounds } from '../sounds/manage_sounds/ManageSounds';
import { spacing2, spacing4 } from '../../styling/spacing';
import {
  auroraSuccess,
  frostPrimary,
  frostTertiary,
  polarLight,
} from '../../styling/colours';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { createToast } from '../../utils/toast';
import produce from 'immer';
import { indexOf, remove } from 'lodash';

export const Home = () => {
  const [sounds, setSounds] = useState<Sounds>();
  const authenticationContext = useContext(AuthenticationContext);
  const [playingSounds, setPlayingSounds] = useState<Array<string>>([]);

  useEffect(() => {
    console.log('soundboard');
    apiRequest<Sounds>('soundboard', createRequestInit('GET')).then(
      (response: Sounds | ApiRequestError) => {
        if (isApiRequestError(response)) {
          handleApiRequestError(response, authenticationContext);
        } else {
          setSounds(response);
        }
      }
    );
  }, []);

  const play = (uuid: string) => {
    apiRequest<string>(
      'sound/queue',
      createRequestInit('POST', { soundId: uuid })
    ).then((response: string | ApiRequestError) => {
      if (isApiRequestError(response)) {
        handleApiRequestError(response, authenticationContext);
      } else {
        createToast(response);
        setPlayingSounds(
          produce(playingSounds, (draft) => {
            draft.push(uuid);
          })
        );
        setTimeout(() => setPlayingSounds(remove(playingSounds, uuid)), 2000);
      }
    });
  };

  if (!sounds) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {sounds.sounds.map((sound) => (
        <SoundButtonContainer>
          <SoundButton
            onClick={() => play(sound.uuid)}
            playing={indexOf(playingSounds, sound.uuid) >= 0}
          />
          <SoundButtonText>{sound.name}</SoundButtonText>
        </SoundButtonContainer>
      ))}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const SoundButtonContainer = styled.div`
  padding: ${spacing4};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 150px;
`;

const SoundButton = styled.div<{ playing: boolean }>`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  background-color: ${(props) =>
    props.playing ? auroraSuccess : frostPrimary};
  border: 2px solid ${polarLight};
  cursor: pointer;

  @media (pointer: fine) {
    &:hover {
      background-color: ${(props) =>
        props.playing ? auroraSuccess : frostTertiary};
    }
  }
`;

const SoundButtonText = styled.div`
  margin-top: ${spacing2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
`;
