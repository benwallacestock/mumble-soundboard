import React from 'react';
import Spinner from '../../styling/icons/spinner.svg';
import styled from 'styled-components';
import { frostPrimary } from '../../styling/colours';

export const LoadingSpinner = () => {
  return (
    <SpinnerContainer>
      <StyledSpinner />
    </SpinnerContainer>
  );
};

const StyledSpinner = styled(Spinner)`
  width: 100px;
  height: 100px;
  color: ${frostPrimary};
`;

const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
