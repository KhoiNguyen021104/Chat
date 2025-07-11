import React, { useState } from "react";
import { ProfileForm, UpdatePasswordForm } from "../section/Profile";
import { useSelector } from "../redux/store";
import { setUser, userSelector } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

export default function Profile() {
  const [openTab, setOpenTab] = useState(1);
  const activeClasses = "text-primary border-primary";
  const inactiveClasses = "border-transparent";
  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  return (
    <div className='w-full rounded-sm border border-stroke bg-[#1f1f1f] py-7.5 px-20 shadow-default dark:border-strokedark dark:bg-boxdark'>
      <div className='mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10'>
        <Link
          to='#'
          onClick={() => setOpenTab(1)}
          className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
            openTab === 1 ? activeClasses : inactiveClasses
          }`}
        >
          Profile
        </Link>

        {!user?.provider && (
          <Link
            to='#'
            onClick={() => setOpenTab(2)}
            className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${
              openTab === 2 ? activeClasses : inactiveClasses
            }`}
          >
            Update Password
          </Link>
        )}
      </div>

      <div>
        {openTab === 1 && <ProfileForm key={user?.display_name} />}
        {openTab === 2 && <UpdatePasswordForm key={user?.id} />}
      </div>
    </div>
  );
}
