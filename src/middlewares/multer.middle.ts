import multer, { Multer, StorageEngine } from "multer";
import BadRequestError from "../errors/bad-request.error";

export const uploadFile = multer({
  limits: {
    fileSize: 1024 * 1024, //1024kb
  },
  fileFilter: (req: any, file: any, callback: any) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "application/pdf"
    ) {
      callback(null, true);
    } else {
      callback(new BadRequestError("Invalid file type/size"));
    }
  },
});
