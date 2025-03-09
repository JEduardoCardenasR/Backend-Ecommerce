import { Provider } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.development.env' });

export const CloudinaryConfig: Provider = {
  provide: 'CLOUDINARY',
  useFactory: (): ConfigOptions => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
