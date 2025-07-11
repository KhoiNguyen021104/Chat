import { StatusCodes } from "http-status-codes";
import multer from "multer";
import ApiError from "~/utils/apiErrors";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/utils/validators";

const customFileFilter = (req, file, cb) => {
  // console.log('🚀 ~ customFileFilter ~ file:', file)

  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg, and png.'
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage), null);
  }

  return cb(null, true)
}


const upload = multer({
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: customFileFilter
})


export const multerUploadMiddleWare = { upload }