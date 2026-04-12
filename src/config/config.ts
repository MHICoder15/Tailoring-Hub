import dotenv from "dotenv";

dotenv.config();

const _config = {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
};

export const config = Object.freeze(_config);