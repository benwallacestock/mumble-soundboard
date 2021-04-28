import React from 'react';
import styled from 'styled-components';
import { spacing1, spacing4, spacing5, spacing7 } from '../../styling/spacing';
import { frostPrimary, polarDark, polarLight } from '../../styling/colours';

export type SwitchProps = {
  onChange: (value: boolean) => void;
  value: boolean;
};

export const Switch = (props: SwitchProps) => {
  return (
    <SwitchContainer
      state={props.value}
      onClick={() => props.onChange(!props.value)}
    >
      <SwitchToggle state={props.value} />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div<{ state: boolean }>`
  width: ${spacing7};
  height: ${spacing5};
  border-radius: 50px;
  background-color: ${(props) => (props.state ? frostPrimary : polarLight)};
  display: flex;
  justify-content: ${(props) => (props.state ? 'flex-end' : 'flex-start')};
  cursor: pointer;
`;

const SwitchToggle = styled.div<{ state: boolean }>`
  height: ${spacing4};
  width: ${spacing4};
  border-radius: 50px;
  background-color: ${polarDark};
  margin: ${spacing1};
`;
