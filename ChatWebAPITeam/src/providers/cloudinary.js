import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { env } from '~/config/environment';

cloudinary.config({
  cloud_name: 'dbyuzvqz8',
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const uploadSingleFile = async (file, folder) => {
  console.log('🚀 ~ uploadSingleFile ~ file:', file)
  return new Promise((resolve, reject) => {
    const fileExtension = file.originalname.split('.').pop();
    const uploadOptions = {
      folder,
      resource_type: file.mimetype.includes('image/') ? 'image' : 'raw',
      public_id: `${Date.now()}.${fileExtension}`,
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);

      const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
      resolve(downloadUrl);
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const uploadMultipleFiles = async (files, folder) => {
  const uploadPromises = files.map(file => uploadSingleFile(file, folder));
  return Promise.all(uploadPromises);
};

export const cloudinaryProvider = { uploadMultipleFiles, uploadSingleFile };
