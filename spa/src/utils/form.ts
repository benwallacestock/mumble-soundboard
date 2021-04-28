import { FormikProps } from 'formik';
import { get } from 'lodash';

export const displayError = <FormValues>(
  formProps: FormikProps<FormValues>,
  fieldName: string
) => {
  return get(formProps.errors, fieldName) && get(formProps.touched, fieldName);
};
