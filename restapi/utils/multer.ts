import multer from "multer";

const storage = multer.diskStorage({
  destination: "../webapp/src/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase()); //+ path.extname(file.originalname).toLowerCase()
  },
});

export default multer({
  storage: storage,
  limits: {
    fileSize: 8000000,
  },
});
