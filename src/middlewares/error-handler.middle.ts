import CustomError from "../errors/custom.error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: inferMsg(err.statusCode),
      errors: err.serializeErrors(),
    });
  }

  console.error(err);
  return res.status(500).json({
    message: inferMsg(err.statusCode),
    errors: [{ message: "Internal Server Error" }],
  });
};

const inferMsg = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Bad Request";
    case 401:
      return "Authentication Error";
    case 404:
      return "Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return "Internal Server Error";
  }
};
