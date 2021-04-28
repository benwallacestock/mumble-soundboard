import styled from 'styled-components';
import { auroraError, frostPrimary, polarDark } from '../../styling/colours';
import { spacing2, spacing4 } from '../../styling/spacing';

export const Button = styled.button`
  background-color: ${frostPrimary};
  border: none;
  padding: ${spacing2} ${spacing4};
  color: ${polarDark};
  border-radius: 5px;
  cursor: pointer;
`;

export const ErrorButton = styled(Button)`
  background-color: ${auroraError};
`;
