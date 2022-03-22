import multer from "multer";

export default multer({
  storage: multer.diskStorage({
    destination: "../webapp/src/images",
    filename: (req, file, cb) => {
      cb(null, file.originalname.toLowerCase()); //+ path.extname(file.originalname).toLowerCase()
    },
  }),
  limits: {
    fileSize: 8000000,
  },
});
