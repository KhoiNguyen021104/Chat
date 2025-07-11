import { DownloadSimple } from "@phosphor-icons/react";
import React from "react";

export default function MediaMsgGrid({ incoming, assets }) {
  const renderImages = () => {
    {
      if (assets?.length === 1) {
        return (
          <div className='col-span-2 row-span-2 relative rounded-2xl'>
            <img
              src={assets[0].file_url}
              className='h-full w-full rounded-lg object-cover object-center'
            />
            <a href={assets[0].file_url} download={assets[0].file_name}>
              <button className='absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white'>
                <DownloadSimple size={20} />
              </button>
            </a>
          </div>
        );
      } else if (assets?.length === 2) {
        return assets.map((image) => (
          <div
            key={image?.file_url}
            className='col-span-1 row-span-2 relative rounded-2xl'
          >
            <img
              src={image?.file_url}
              className='h-full w-full rounded-lg object-cover object-center'
            />
            <a href={image.file_url} download={image.file_name}>
              <button className='absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white'>
                <DownloadSimple size={20} />
              </button>
            </a>
          </div>
        ));
      } else if (assets?.length === 3) {
        return (
          <>
            {assets?.slice(0, 3).map((image) => (
              <div
                key={image?.file_url}
                className='col-span-1 row-span-1 relative rounded-2xl'
              >
                <img
                  src={image?.file_url}
                  className='h-full w-full rounded-lg object-cover object-center'
                />
                <a href={image.file_url} download={image.file_name}>
                  <button className='absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white'>
                    <DownloadSimple size={20} />
                  </button>
                </a>
              </div>
            ))}
          </>
        );
      } else if (assets?.length === 4) {
        return (
          <>
            {assets?.slice(0, 4).map((image) => (
              <div
                key={image?.file_url}
                className='col-span-1 row-span-1 relative rounded-2xl'
              >
                <img
                  src={image?.file_url}
                  className='h-full w-full rounded-lg object-cover object-center'
                />
                <a href={image.file_url} download={image.file_name}>
                  <button className='absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white'>
                    <DownloadSimple size={20} />
                  </button>
                </a>
              </div>
            ))}
          </>
        );
      } else {
        return (
          <>
            {assets?.slice(0, 3).map((image) => (
              <div
                key={image?.file_url}
                className='col-span-1 row-span-1 relative rounded-2xl'
              >
                <img
                  src={image?.file_url}
                  className='h-full w-full rounded-lg object-cover object-center'
                />
                <a href={image.file_url} download={image.file_name}>
                  <button className='absolute top-3 right-4 bg-gray/80 dark:bg-boxdark p-2 rounded-md hover:bg-opacity-80 hover:cursor-pointer hover:text-black dark:hover:text-white'>
                    <DownloadSimple size={20} />
                  </button>
                </a>
              </div>
            ))}
            <div className='relative rounded-2xl bg-body/50 flex flex-row items-center justify-center text-xl text-white font-semibold'>
              <div>+{assets?.length - 3}</div>
            </div>
          </>
        );
      }
    }
  };

  return (
    <div
      className={`grid grid-cols-2 grid-rows-2 pt-4 pb-2 gap-3 rounded-2xl rounded-tl-none ${
        incoming ? "dark:bg-boxdark-2" : "bg-transparent"
      }`}
    >
      {renderImages()}
    </div>
  );
}
