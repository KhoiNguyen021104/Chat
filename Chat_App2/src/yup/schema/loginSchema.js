import yup from '../yupGlobal';

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username required'),
  password: yup
    .string()
    .required('Password required')
    .password('Password needs >=8 chars, A-Z, 0-9')
});
