import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import {
  auroraError,
  auroraSuccess,
  auroraWarning,
  frostPrimary,
  snow,
} from '../styling/colours';

export enum ToastType {
  INFO,
  ERROR,
  WARNING,
  SUCCESS,
}

export const createToast = (text: string, type: ToastType = ToastType.INFO) => {
  switch (type) {
    case ToastType.INFO:
      toast(text, { position: 'bottom-right' });
      break;
    case ToastType.ERROR:
      toast.error(text, { position: 'bottom-right' });
      break;
    case ToastType.WARNING:
      toast.warning(text, { position: 'bottom-right' });
      break;
    case ToastType.SUCCESS:
      toast.success(text, { position: 'bottom-right' });
      break;
  }
};

export const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast--default {
    background-color: ${frostPrimary};
    color: ${snow};
  }

  .Toastify__toast--error {
    background-color: ${auroraError};
    color: ${snow};
  }

  .Toastify__toast--warning {
    background-color: ${auroraWarning};
    color: ${snow};
  }

  .Toastify__toast--success {
    background-color: ${auroraSuccess};
    color: ${snow};
  }

  .Toastify__progress-bar {
    background: ${snow} none;
  }
`;
