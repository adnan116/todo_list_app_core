import mongoose from "mongoose";
import { dbHost, dbPort, dbUser, dbPassword, dbName } from "./app.config";

// Construct MongoDB connection URI
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority&appName=${dbName}`;

const mongooseOptions = {
  dbName: dbName,
  user: dbUser,
  pass: dbPassword,
  autoIndex: true,
};

// Establish connection with MongoDB
const connectDB = async () => {
  try {
    const db = await mongoose.connect(mongoURI, mongooseOptions);
    console.log("[DATABASE SERVER] Database connected successfully");
    return db;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export { connectDB };
