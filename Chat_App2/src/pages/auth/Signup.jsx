import { EnvelopeSimple, Lock, User } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router";
import SignupIllustration from "../../assets/images/chat-signup.svg";
import Logo from "../../components/Logo";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../yup/schema/registerSchema";
import { createUserAPI } from "../../apis/apis";
import { useDispatch } from "../../redux/store";
import { setRegisterInfo } from "../../redux/slices/registerInfoSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    console.log('🚀 ~ onSubmit ~ data:', data)
    delete data.confirmPassword;
    const res = await createUserAPI(data);
    console.log("🚀 ~ onSubmit ~ res:", res);
    if (res) {
      dispatch(setRegisterInfo(res));
      navigate("/verify", {
        state: res.id,
      });
    }
  };

  return (
    <div className='bg-white h-screen block'>
      <div className='flex flex-wrap items-center h-full'>
        <div className='hidden w-full xl:block xl:w-1/2'>
          <div className='py-12.5 px-26 text-center'>
            <Link to='/#' className='mb-5.5 inline-block'>
              <Logo />
            </Link>

            <p className='2xl:px-20'>
              Join Messenger & experience the modern way to connect with people
            </p>

            <span className='mt-15 inline-block'>
              <img
                src={SignupIllustration}
                alt='Singup'
                className='w-64 h-auto object-cover'
              />
            </span>
          </div>
        </div>
        <div className='w-full xl:w-1/2 border-[#E2E8F0] xl:border-l-2 px-10 md:px-10 xl:px-30'>
          <div className='w-full p-4 sm:p-8 md:p-10 xl:p-2'>
            <h2 className='mb-7 text-2xl font-bold text-black sm:text-2xl md:text-[27px] xl:text-3xl sm:leading-tight'>
              Sign Up to Messenger
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-black'>
                  Username
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Enter your username'
                    className={`w-full rounded-lg border border-[#E2E8F0] bg-transparent py-3 sm:py-4 pl-6 pr-10 text-black outline-none focus:border-[#0866FF] focus-visible:shadow-none ${
                      errors.name
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#0866FF]"
                    }`}
                    name='username'
                    {...register("username", { required: true })}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <User size={24} />
                  </span>
                </div>
                {errors.name && (
                  <p className='text-red-400 !font-normal mt-1 text-red'>
                    {errors.name?.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-black'>
                  Email
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    className={`w-full rounded-lg border border-[#E2E8F0] bg-transparent py-3 sm:py-4 pl-6 pr-10 text-black outline-none focus:border-[#0866FF] focus-visible:shadow-none ${
                      errors.email
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#0866FF]"
                    }`}
                    name='email'
                    {...register("email", { required: true })}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <EnvelopeSimple size={24} />
                  </span>
                </div>
                {errors.email && (
                  <p className='text-red-400 !font-normal mt-1 text-red'>
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <div className='mb-4'>
                <label className='mb-2 block font-medium text-black'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    placeholder='Enter your password'
                    className={`w-full rounded-lg border border-[#E2E8F0] bg-transparent py-3 sm:py-4 pl-6 pr-10 text-black outline-none focus:border-[#0866FF] focus-visible:shadow-none ${
                      errors.password
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#0866FF]"
                    }`}
                    name='password'
                    {...register("password", { required: true })}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <Lock size={24} />
                  </span>
                </div>
                {errors.password && (
                  <p className='text-red-400 !font-normal mt-1 text-red'>
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <div className='mb-6'>
                <label className='mb-2 block font-medium text-black'>
                  Re-Type Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    placeholder='Retype your password'
                    className={`w-full rounded-lg border border-[#E2E8F0] bg-transparent py-3 sm:py-4 pl-6 pr-10 text-black outline-none focus:border-[#0866FF] focus-visible:shadow-none ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#0866FF]"
                    }`}
                    name='confirmPassword'
                    {...register("confirmPassword", { required: true })}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <Lock size={24} />
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-400 !font-normal mt-1 text-red'>
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              <div className='mb-5'>
                <input
                  type='submit'
                  value='Create account'
                  className='w-full cursor-pointer border border-[#0866FF] bg-[#0866FF] p-4 rounded-lg text-white transition hover:bg-[#0867ffe9]'
                />
              </div>

              <div className='mt-6 text-center'>
                <p>
                  Don't have an account?{" "}
                  <Link to='/verify' className='text-[#0866FF]'>
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
