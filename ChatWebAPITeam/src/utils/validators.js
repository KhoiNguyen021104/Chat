export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'



// FILE
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf', 'application/doc', 'application/docx'];

export const validateFile = (file) => {
  if (!file?.name || !file?.size || !file?.type) {
    return 'File cannot be blank.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)';
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg, and png.';
  }
  return null;
};
