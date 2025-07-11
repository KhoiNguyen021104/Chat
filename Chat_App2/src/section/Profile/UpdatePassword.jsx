import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { updatePasswordSchema } from "../../yup/schema/updatePasswordSchema";
import { useForm } from "react-hook-form";
import { updateUserAPI } from "../../apis/apis";
import { useSelector } from "../../redux/store";
import { userSelector } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";

export default function UpdatePassword() {
  const user = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(updatePasswordSchema),
  });

  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    if (data.current_password === data.new_password) {
      toast.error("New password cannot be the same as current password");
      return;
    }

    const updateData = {
      current_password: data.current_password,
      new_password: data.new_password,
    };

    setIsLoading(true);

    try {
      const res = await updateUserAPI(user?.id, updateData);
      if (res) {
        toast.success("Updated password successfully");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-5.5 p-6.5'
        >
          <div>
            <label className='mb-3 block text-black dark:text-white'>
              Current password
            </label>
            <input
              type='text'
              placeholder='Enter your current password'
              name='current_password'
              {...register("current_password", { required: true })}
              className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary
                  ${
                    errors.current_password
                      ? "border-red-400 focus:border-red-400"
                      : "border-[#0866FF]"
                  }
                  `}
            />
            {errors.current_password && (
              <p className='text-red-400 !font-normal mt-1 text-red'>
                {errors.current_password?.message}
              </p>
            )}
          </div>
          <div>
            <label className='mb-3 block text-black dark:text-white'>
              New password
            </label>
            <input
              type='password'
              placeholder='Enter your new password'
              name='new_password'
              {...register("new_password", { required: true })}
              className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary
                  ${
                    errors.new_password
                      ? "border-red-400 focus:border-red-400"
                      : "border-[#0866FF]"
                  }
                  `}
            />
            {errors.new_password && (
              <p className='text-red-400 !font-normal mt-1 text-red'>
                {errors.new_password?.message}
              </p>
            )}
          </div>
          <div>
            <label className='mb-3 block text-black dark:text-white'>
              Confirm new password
            </label>
            <input
              type='password'
              placeholder='Retype new password'
              name='confirm_password'
              {...register("confirm_password", { required: true })}
              className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary
                  ${
                    errors.confirm_password
                      ? "border-red-400 focus:border-red-400"
                      : "border-[#0866FF]"
                  }
                  `}
            />
            {errors.confirm_password && (
              <p className='text-red-400 !font-normal mt-1 text-red'>
                {errors.confirm_password?.message}
              </p>
            )}
          </div>
          <input
            type='submit'
            value='Submit'
            className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'
          />
        </form>
      </div>
    </>
  );
}
