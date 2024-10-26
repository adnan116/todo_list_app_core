import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../../models/user";
import RoleFeature from "../../../models/role-feature";
import Feature from "../../../models/feature";
import AuthError from "../../../errors/auth.error";
import { userTokenData } from "../interfaces/user.interface";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export interface AuthRequest extends Request {
  user?: userTokenData;
}

// Authenticate JWT token
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new AuthError("No token provided"));
  }

  const token = authHeader ? authHeader.split(" ")[1] : "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as userTokenData;
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      roleId: decoded.roleId,
      userType: decoded.userType,
    };
    next();
  } catch (err) {
    next(new AuthError("Invalid or expired token"));
  }
};

// Check if user has permission for the requested feature
export const checkPermission = (featureName: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { roleId } = req.user!;

    try {
      // Find the feature by its name
      const feature = await Feature.findOne({ feature_name: featureName });
      if (!feature) {
        return next(new AuthError("Feature not found in the system"));
      }

      // Check if the role has access to the feature
      const roleFeature = await RoleFeature.findOne({
        role_id: roleId,
        feature_id: feature._id, // Use `_id` for MongoDB
      });

      if (!roleFeature) {
        return next(
          new AuthError("You do not have permission to access this feature")
        );
      }

      // If everything is fine, proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      next(error);
    }
  };
};
