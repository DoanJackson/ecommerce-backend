import dotenv from "dotenv";

dotenv.config();

function getEnv(key) {
  return process.env[key];
}

export { getEnv };
