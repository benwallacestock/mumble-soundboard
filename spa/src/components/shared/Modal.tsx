import React from 'react';
import styled from 'styled-components';
import { frostPrimary, polar } from '../../styling/colours';
import { spacing10, spacing6 } from '../../styling/spacing';
import TimesSolid from '../../styling/icons/times-solid.svg';

export type ModalProps = {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
};

export const Modal = (props: ModalProps) => {
  return (
    <ModalFullscreen open={props.open}>
      <ModalContainer>
        <TopBar>
          {props.title && <ModalTitle>{props.title}</ModalTitle>}
          <CloseIcon onClick={() => props.setOpen(false)} />
        </TopBar>
        {props.children}
      </ModalContainer>
    </ModalFullscreen>
  );
};

const ModalFullscreen = styled.div<{ open: boolean }>`
  display: ${(props) => (props.open ? 'flex' : 'none')};
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.6);
  padding-top: ${spacing10};
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: ${spacing6};
  background-color: ${polar};
  border-radius: 5px;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

const ModalTitle = styled.h4`
  margin-top: 0;
`;

const CloseIcon = styled(TimesSolid)`
  height: 40px;
  width: 40px;
  margin-left: auto;

  &:hover {
    color: ${frostPrimary};
    cursor: pointer;
  }
`;
