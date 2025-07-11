import { Link, useNavigate } from "react-router";
import { EnvelopeSimple, Lock } from "@phosphor-icons/react";
import LoginIllustration from "../../assets/images/chat-login.svg";
import Logo from "../../components/Logo";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../yup/schema/loginSchema";
import { toast } from "react-toastify";
import LoginGoogle from "./LoginGoogle";
import { loginAPI } from "../../apis/apis";
import { useDispatch } from "../../redux/store";
import { setUser } from "../../redux/slices/userSlice";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const res = await loginAPI(data);
    console.log("🚀 ~ onSubmit ~ res:", res);
    if (res) {
      toast.success("Login successfully");
      dispatch(setUser(res));
      navigate("/chat");
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
              Hey there 🫁, Welcome back. Login to chat with your friends &
              collections
            </p>

            <span className='mt-15 inline-block'>
              <img
                src={LoginIllustration}
                alt='Login'
                className='w-64 h-auto object-cover'
              />
            </span>
          </div>
        </div>
        <div className='w-full xl:w-1/2 border-[#E2E8F0] xl:border-l-2 px-10 md:px-10 xl:px-30'>
          <div className='w-full p-4 sm:p-8 md:p-10 xl:p-12.5'>
            <h2 className='mb-7 text-2xl font-bold text-black sm:text-2xl md:text-[27px] xl:text-3xl sm:leading-tight'>
              Sign In to Messenger
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
                      errors.username
                        ? "border-red-400 focus:border-red-400"
                        : "border-[#0866FF]"
                    }`}
                    name='username'
                    {...register("username")}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <EnvelopeSimple size={24} />
                  </span>
                </div>
                {errors.username && (
                  <p className='text-red-400 !font-normal mt-1'>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className='mb-6'>
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
                    {...register("password")}
                  />
                  <span className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <Lock size={24} />
                  </span>
                </div>
                {errors.password && (
                  <p className='text-red-400 font-stretch-normal mt-1'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='mb-5'>
                <input
                  type='submit'
                  value='Sign In'
                  className='w-full cursor-pointer border border-[#0866FF] bg-[#0866FF] p-4 rounded-lg text-white transition hover:bg-[#0867ffe9]'
                />
              </div>
            </form>
            <LoginGoogle />

            <div className='mt-6 text-center'>
              <p>
                Don't have an account?{" "}
                <Link to='/register' className='text-[#0866FF]'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
