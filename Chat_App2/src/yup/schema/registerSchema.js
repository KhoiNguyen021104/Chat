import yup from '../yupGlobal';

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username required')
    .min(8, "Username must be at least 8 characters"),
  email: yup
    .string()
    .required('Email required')
    .email("Email invalid"),
  password: yup
    .string()
    .required('Password required')
    .password('Password must be at least 8 characters, contains a-z A-z 0-9'),
  confirmPassword: yup
    .string()
    .required('Confirm password required')
    .password('Password must be at least 8 characters, contains a-z A-z 0-9')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
