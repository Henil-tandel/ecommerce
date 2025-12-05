import Joi, { ValidationResult } from 'joi';
import dotenv from 'dotenv';
import path from 'path';

interface IEnvVars {
  PORT: string;
  NODE_ENV: string;
  DEBUG: string;
  JWT_SECRET: string;
  DATABASE_HOST: string;
  // DB_PORT: string;
  DATABASE_USER_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE: string;
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string

}
// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

// Define schema for environment variables with clear types
const schema: Joi.ObjectSchema<IEnvVars> = Joi.object<IEnvVars, true, IEnvVars>({
  PORT: Joi.string().required().description('Port is required'),
  NODE_ENV: Joi.string().required().description('NODE_ENV is required'),
  DEBUG: Joi.string().required().description('DEBUG is required'),
  JWT_SECRET: Joi.string().required().description('JWT_SECRET is required'),
  DATABASE_HOST: Joi.string().required().description('DATABASE_HOST is required'),
  // DB_PORT: Joi.string().required().description('DB_PORT is required'),
  DATABASE_USER_NAME: Joi.string().required().description('DATABASE_USER_NAME is required'),
  DATABASE_PASSWORD: Joi.string().required().description('DATABASE_PASSWORD is required'),
  DATABASE: Joi.string().required().description('DATABASE is required'),
  CLOUDINARY_CLOUD_NAME: Joi.string().required().description('CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: Joi.string().required().description('CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: Joi.string().required().description('CLOUDINARY_API_SECRET is required'),
})
  .unknown()
  .required();

const { error, value }: ValidationResult<IEnvVars> = schema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnvVars = value as IEnvVars;

const config: IEnvVars = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  DEBUG: envVars.DEBUG,
  JWT_SECRET: envVars.JWT_SECRET,
  DATABASE_HOST: envVars.DATABASE_HOST,
  // DB_PORT: envVars.DB_PORT,
  DATABASE_USER_NAME: envVars.DATABASE_USER_NAME,
  DATABASE_PASSWORD: envVars.DATABASE_PASSWORD,
  DATABASE: envVars.DATABASE,
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET
};

export default config;
