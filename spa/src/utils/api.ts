import { includes } from 'lodash';
import { AuthenticationContextValue } from '../components/authentication/context/AuthenticationContext';
import { createToast, ToastType } from './toast';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

const url =
  location.protocol +
  '//' +
  location.hostname +
  (location.port ? ':' + location.port : '') +
  '/api';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) return parts.pop()?.split(';').shift();
}

export const createRequestInit = <T>(
  httpMethod: HttpMethod,
  body?: T
): RequestInit =>
  ({
    headers: {
      Accept: 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
    },
    method: httpMethod,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined,
  } as RequestInit);

export const createFormDataRequestInit = <T>(
  httpMethod: HttpMethod,
  body: FormData
): RequestInit =>
  ({
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      'Cache-Control': 'no-cache',
    },
    method: httpMethod,
    credentials: 'same-origin',
    body: body,
  } as RequestInit);

const parseResponse = <T>(response: Response): Promise<T> => {
  return includes(
    response.headers.get('content-type') as string,
    'application/json'
  )
    ? response.json()
    : response.text();
};

export type ApiRequestError = {
  statusCode: number;
  statusText: string;
};

export const isApiRequestError = <T>(
  x: T | ApiRequestError
): x is ApiRequestError => (x as ApiRequestError).statusCode !== undefined;

export const handleApiRequestError = (
  apiRequestError: ApiRequestError,
  authenticationContext: AuthenticationContextValue
) => {
  if (apiRequestError.statusCode == 401) {
    createToast('User is not authenticated, please login', ToastType.ERROR);
    authenticationContext.refreshUser();
  } else {
    createToast(apiRequestError.statusText, ToastType.ERROR);
  }
};

export const apiRequest = <T>(
  endpoint: string,
  requestInit: RequestInit
): Promise<T | ApiRequestError> => {
  return fetch(url + '/' + endpoint, requestInit).then(async (response) => {
    if (!response.ok) {
      return {
        statusCode: response.status,
        statusText: await response.text(),
      };
    }
    return await parseResponse<T>(response);
  });
};
