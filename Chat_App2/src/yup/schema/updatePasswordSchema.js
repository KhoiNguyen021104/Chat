import yup from '../yupGlobal';

export const updatePasswordSchema = yup.object().shape({
  current_password: yup
    .string()
    .required('Password required')
    .password('Password must be at least 8 characters, contains a-z A-z 0-9'),
  new_password: yup
    .string()
    .required('Password required')
    .password('Password must be at least 8 characters, contains a-z A-z 0-9'),
  confirm_password: yup
    .string()
    .required('Confirm password required')
    .password('Password must be at least 8 characters, contains a-z A-z 0-9')
    .oneOf([yup.ref('new_password')], 'Passwords must match'),
});
