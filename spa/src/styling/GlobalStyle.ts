import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { polarDark, snow } from './colours';
import {
  heading1FontSize,
  heading2FontSize,
  heading3FontSize,
  heading4FontSize,
  heading5FontSize,
  paragraphText,
} from './fonts';
import { spacing2, spacing5 } from './spacing';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, sans-serif;
    background-color: ${polarDark};
    color: ${snow};
    display: flex;
    justify-content: center;
    font-size: ${paragraphText};
    margin: ${spacing2} ${spacing5};
    
    #app {
      width: 100%;
      max-width: 800px;
    }
    
    input {
      font-size: ${paragraphText};
    }      
    
    label {
      font-size: ${paragraphText};
    }
    
    button {
      font-size: ${paragraphText};
    }
    
    h1{
      font-size: ${heading1FontSize};
    }    
    h2{
      font-size: ${heading2FontSize};
    }    
    h3{
      font-size: ${heading3FontSize};
    }    
    h4{
      font-size: ${heading4FontSize};
    }    
    h5{
      font-size: ${heading5FontSize};
    }
  }
`;
