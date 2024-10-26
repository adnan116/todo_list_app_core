import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// application config
export const appPort = process.env.APP_PORT || 5000;

// Moment.js timezone and time format
export const defaultTimezone = "Asia/Dhaka";
export const defaultDateFormat = "YYYY/MM/DD";

// Database config (fetch from process.env)
export const dbHost = process.env.DB_HOST || "";
export const dbPort = process.env.DB_PORT || 5432;
export const dbUser = process.env.DB_USER || "";
export const dbPassword = process.env.DB_PASSWORD || "";
export const dbName = process.env.DB_NAME || "";

// user token
export const jwtSecret = process.env.JWT_SECRET;
export const tokenExpireTime = process.env.TOKEN_EXPIRE_TIME;

// llm
export const ollamaBaseUrl = process.env.OLLAMA_BASE_URL;
export const modelName = process.env.MODEL_NAME;
