import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Logo from "../../components/Logo";
import { updateUserAPI } from "../../apis/apis";
import { toast } from "react-toastify";

export default function Verify() {
  const [otp, setOtp] = useState(Array(4).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const handleVerify = async () => {
    const res = await updateUserAPI(location.state, { otp: otp.join("") });
    if (res) {
      toast.success("Verified account successfully");
      navigate("/login");
    }
  };

  return (
    <div className='overflow-hidden px-4 sm:px-8'>
      <div className='flex h-screen flex-col items-center justify-center overflow-hidden'>
        <div className='no-scrollbar overflow-y-auto py-20'>
          <div className='mx-auto w-full max-w-[480px]'>
            <div className='text-center'>
              <Link to='/' className='mx-auto mb-10 inline-flex'>
                <Logo />
              </Link>

              <div className='bg-white p-4 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.10)] rounded-xl lg:p-7.5 xl:p-12.5'>
                <h1 className='mg-2.5 text-3xl font-black leading-[48px] text-black'>
                  Verify your account
                </h1>

                <p className='mb-7.5 font-medium'>
                  Enter the 4 digit code sent to the registered email id
                </p>

                <div>
                  <div className='flex items-center gap-4.5'>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        maxLength={1}
                        type='text'
                        value={value}
                        className='w-full rounded-md border-[1.5px] border-[#E2E8F0] bg-transparent px-3 py-3 text-center text-black outline-none
                        transition focus:border-[#0866FF] active:border-[#0866FF] disabled:cursor-default disabled:bg-[#F5F7FD]'
                        onChange={(e) => {
                          const newOtp = [...otp];
                          newOtp[index] = e.target.value;
                          setOtp(newOtp);
                        }}
                      />
                    ))}
                  </div>

                  <p className='mb-5 mt-4 text-left font-medium space-x-2 flex flex-row items-center'>
                    <div>Did not receive a code?</div>
                    <button className='text-[#0866FF] cursor-pointer'>
                      Resend
                    </button>
                  </p>

                  <button
                    className='flex w-full justify-center rounded-md bg-[#0866FF] p-[13px] cursor-pointer font-bold text-white hover:bg-[#0867ffe9]'
                    onClick={handleVerify}
                  >
                    Verify
                  </button>

                  <span className='mt-5 block text-red-400'>
                    Don't share the verification code with anyone!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
