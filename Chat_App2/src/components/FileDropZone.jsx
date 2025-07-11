import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Dropzone } from "dropzone";
import { UploadSimple } from "@phosphor-icons/react";
import { createMessageFileAPI } from "../apis/apis";
import { socket } from "../socket/socket";
import { useDispatch, useSelector } from "../redux/store";
import { ToogleDocumentModal, ToogleMediaModal } from "../redux/slices/app";
import { API_ROOT } from "../config/constants";
import { receiverSelector } from "../redux/slices/receiverSlice";
import { pushMessage } from "../redux/slices/messagesSlice";

const FileDropZone = forwardRef(
  (
    {
      acceptedFiles = "image/*, video/*",
      maxFileSize = 16 * 1024 * 1024,
      url = `${API_ROOT}/v1/messages/upload`,
      parallelUploads = 5,
    },
    ref
  ) => {
    const formRef = useRef(null);
    const dropzoneRef = useRef(null);
    const dispatch = useDispatch();
    const { receiver } = useSelector(receiverSelector);

    useEffect(() => {
      Dropzone.autoDiscover = false;

      if (!dropzoneRef.current && formRef.current) {
        dropzoneRef.current = new Dropzone(formRef.current, {
          url,
          acceptedFiles,
          maxFilesize: maxFileSize / (1024 * 1024),
          autoProcessQueue: false,
          parallelUploads: parallelUploads,
          withCredentials: true,
        });
      }

      return () => {
        if (dropzoneRef.current) {
          dropzoneRef.current.destroy();
          dropzoneRef.current = null;
        }
      };
    }, [acceptedFiles, maxFileSize, parallelUploads, url]);

    useImperativeHandle(ref, () => ({
      handleUpload: async (message) => {
        if (!dropzoneRef.current) return;

        const files = dropzoneRef.current?.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        const fileInfoArray = [];
        const blobUrls = [];
        for (let i = 0; i < files.length; i++) {
          blobUrls.push({
            file_url: URL.createObjectURL(files[i]),
            file_name: files[i].name,
            file_size: files[i].size,
            file_type: files[i].type,
          });
          formData.append("message_file", files[i]);
          fileInfoArray.push({
            message_id: message.id,
            file_name: files[i].name,
            file_size: files[i].size,
            file_type: files[i].type,
          });
        }
        formData.append("file_info", JSON.stringify(fileInfoArray));
        const bufferFiles = await Promise.all(
          files.map(
            (file) =>
              new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    buffer: reader.result,
                    file_name: file.name,
                    file_size: file.size,
                    file_type: file.type,
                  });
                };
                reader.readAsArrayBuffer(file);
              })
          )
        );
        // message = { ...message, blobUrls };
        dispatch(pushMessage({ ...message, files: [...blobUrls] }));
        message = { ...message, bufferFiles };
        socket.emit("sendMessage", { message, receiverId: receiver?.id });
        dropzoneRef.current.removeAllFiles();
        dispatch(ToogleMediaModal(false));
        dispatch(ToogleDocumentModal(false));
        await createMessageFileAPI(formData);
      },
      getFiles: () => {
        return dropzoneRef.current?.files;
      },
    }));

    return (
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
        <div className='p-6.5'>
          <form
            action={url}
            ref={formRef}
            id='upload'
            className='dropzone rounded-md !border-dashed !border-bodydark1 bg-gray hover:!border-primary dark:!border-strokedark dark:bg-graydark dark:hover:!border-primary'
          >
            <div className='dz-message'>
              <div className='mb-2.5 flex justify-center flex-col items-center space-y-2'>
                <div className='shadow-10 flex h-15 w-15 items-center justify-center rounded-full bg-white text-black dark:bg-black dark:text-white '>
                  <UploadSimple size={24} />
                </div>
                <span className='font-medium text-black dark:text-white'>
                  Drop files here to upload
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default FileDropZone;
