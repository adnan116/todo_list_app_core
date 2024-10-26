import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { dbHost, dbPort, dbUser, dbPassword, dbName } from "./app.config";
import Role from "../models/role";
import Feature from "../models/feature";
import RoleFeature from "../models/role-feature";
import User from "../models/user"; // Import the User model

// Construct MongoDB connection URI
const mongoURI = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const mongooseOptions = {
  dbName: dbName,
  user: dbUser,
  pass: dbPassword,
  autoIndex: true,
};

// Load role-feature data from JSON file
const roleFeatureDataPath = path.resolve(
  __dirname,
  "../utils/initial-data/role-feature-data.json"
);
let roleFeatureData: any;

try {
  const data = fs.readFileSync(roleFeatureDataPath, "utf-8");
  roleFeatureData = JSON.parse(data);
} catch (error) {
  console.error("Error reading role-feature data file:", error);
  throw error;
}

// Load user data from JSON file
const userDataPath = path.resolve(
  __dirname,
  "../utils/initial-data/user-data.json"
);
let userData: any;

try {
  const data = fs.readFileSync(userDataPath, "utf-8");
  userData = JSON.parse(data);
} catch (error) {
  console.error("Error reading user data file:", error);
  throw error;
}

// Function to initialize roles, features, and role-feature mappings
const initializeRolesAndFeatures = async () => {
  try {
    const { roles, features, roleFeatureMap } = roleFeatureData;

    // Create roles
    const createdRoles = await Promise.all(
      roles.map(async (role: any) => {
        let existingRole = await Role.findOne({ role_name: role.role_name });
        if (!existingRole) {
          existingRole = await Role.create(role);
        }
        return existingRole;
      })
    );

    // Create features
    const createdFeatures = await Promise.all(
      features.map(async (feature: any) => {
        let existingFeature = await Feature.findOne({
          feature_name: feature.feature_name,
        });
        if (!existingFeature) {
          existingFeature = await Feature.create(feature);
        }
        return existingFeature;
      })
    );

    // Map features to roles based on the roleFeatureMap
    for (const [roleName, featureNames] of Object.entries(roleFeatureMap)) {
      const role = createdRoles.find((r: any) => r.role_name === roleName);
      if (role) {
        for (const featureName of featureNames as any) {
          const feature = createdFeatures.find(
            (f: any) => f.feature_name === featureName
          );
          if (feature) {
            // Check if the role-feature mapping already exists
            const existingMapping = await RoleFeature.findOne({
              role_id: role._id,
              feature_id: feature._id,
            });
            if (!existingMapping) {
              await RoleFeature.create({
                role_id: role._id,
                feature_id: feature._id,
              });
            }
          }
        }
      }
    }

    // Hash the password for the admin user
    const hashedPassword = await bcrypt.hash(userData.adminUser.password, 10);

    // Create admin user with the hashed password
    const adminRole = createdRoles.find((role) => role.role_name === "admin");
    if (adminRole) {
      const adminUserDocument = new User({
        first_name: userData.adminUser.first_name,
        last_name: userData.adminUser.last_name,
        dob: userData.adminUser.dob,
        phone_number: userData.adminUser.phone_number,
        email: userData.adminUser.email,
        gender: userData.adminUser.gender,
        religion: userData.adminUser.religion,
        username: userData.adminUser.username,
        password: hashedPassword, // Use hashed password
        is_active: userData.adminUser.is_active,
        role_id: adminRole._id, // Associate with admin role
        created_by: userData.adminUser.created_by,
      });

      await adminUserDocument.save(); // Save the admin user to the database
      console.log("[DATABASE INIT] Admin user created successfully.");
    } else {
      console.error(
        "[DATABASE INIT] Admin role not found, admin user not created."
      );
    }

    console.log(
      "[DATABASE INIT] Roles, Features, and Role-Feature mappings initialized successfully."
    );
  } catch (error) {
    console.error(
      "[DATABASE INIT] Error initializing roles and features:",
      error
    );
  }
};

// Establish connection with MongoDB
const connectDB = async () => {
  try {
    const db = await mongoose.connect(mongoURI, mongooseOptions);
    console.log("[DATABASE SERVER] Database connected successfully");

    // Initialize roles and features
    await initializeRolesAndFeatures();

    return db;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

export { connectDB };
