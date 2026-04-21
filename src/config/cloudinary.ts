import { v2 as cloudinary } from 'cloudinary';
import { config } from './config.ts';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinaryCloudName as string,
  api_key: config.cloudinaryApiKey as string,
  api_secret: config.cloudinaryApiSecret as string
});

export default cloudinary;