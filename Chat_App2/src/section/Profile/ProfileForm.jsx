import React, { useEffect, useState } from "react";
import User01 from "../../assets/images/user/user-01.png";
import { Camera } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "../../redux/store";
import { setUser, userSelector } from "../../redux/slices/userSlice";
import { getUserByIdAPI, updateUserAPI } from "../../apis/apis";
import { toast } from "react-toastify";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";

export default function ProfileForm() {
  const user = useSelector(userSelector);
  const [avatar, setAvatar] = useState();
  const [inputValues, setInputValues] = useState({
    display_name: "",
    bio: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setInputValues((prev) => ({
        ...prev,
        display_name: user.display_name || "",
        bio: user?.bio || "",
      }));
      setAvatar(user?.avatar);
    }
  }, [user]);

  const handleUpdateUserInfo = async () => {
    if (user?.id) {
      if (!inputValues.display_name?.trim()) {
        toast.error("Display name cannot be empty");
        return;
      }
      const updateData = {};
      if (inputValues.display_name?.trim() !== user?.display_name?.trim()) {
        updateData.display_name = inputValues.display_name;
      }
      if (inputValues.bio?.trim() !== user?.bio?.trim()) {
        updateData.bio = inputValues.bio;
      }
      if (Object.keys(updateData).length !== 0) {
        try {
          setIsLoading(true);
          console.log("Start updating user info, isLoading:", isLoading);
          const res = await updateUserAPI(user?.id, updateData);
          if (res) {
            toast.success("Update profile successfully");
            dispatch(
              setUser({
                ...user,
                ...updateData,
              })
            );
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // const imageUrl = URL.createObjectURL(file);
      // setAvatar(imageUrl);
      try {
        const formData = new FormData();
        formData.append("avatar", file);
        setIsLoading(true);
        console.log("Start updating avatar, isLoading:", isLoading);
        const res = await updateUserAPI(user?.id, formData);
        if (res) {
          // setAvatar(imageUrl);
          toast.success("Update avatar successfully");
          const newUser = await getUserByIdAPI(user?.id);
          if (newUser) {
            setAvatar(newUser?.avatar);
            dispatch(setUser(newUser));
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className='flex flex-col w-full p-4 space-y-6'>
        <div className='relative z-30 w-full rounded-full p-1 backdrop-blur sm:max-w-36 sm:p-3'>
          <div className='relative drop-shadow-2'>
            <img
              src={avatar}
              alt='User avatar'
              className='rounded-full object-center object-cover w-[120px] h-[120px]'
            />
            <label
              htmlFor='profile'
              className='absolute cursor-pointer bottom-0 p-2 right-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2'
            >
              <Camera size={20} />
              <input
                type='file'
                name='profile'
                id='profile'
                className='sr-only'
                accept='image/*'
                onChange={handleChangeAvatar}
              />
            </label>
          </div>
        </div>

        <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
          <div>
            <div className='flex flex-col gap-5.5 p-6.5'>
              <div>
                <label className='mb-3 block text-black dark:text-white'>
                  Display name
                </label>
                <input
                  value={inputValues.display_name} // Thay defaultValue bằng value để đồng bộ state
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      display_name: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter your name'
                  className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                />
              </div>
              <div>
                <label className='mb-3 block text-black dark:text-white'>
                  Bio
                </label>
                <textarea
                  value={inputValues.bio} // Thay defaultValue bằng value để đồng bộ state
                  onChange={(e) =>
                    setInputValues((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  placeholder='Enter your bio'
                  className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                ></textarea>
              </div>
              <button
                className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'
                onClick={handleUpdateUserInfo}
                disabled={isLoading} // Disable nút khi đang loading
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
