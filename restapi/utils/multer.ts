import multer from "multer";

let multerStorage = multer.diskStorage({
  destination: "./public",
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname.toLowerCase()); //+ path.extname(file.originalname).toLowerCase()
  },
});

export default multer({
  storage: multerStorage,
  limits: {
    fileSize: 8000000,
  },
});
