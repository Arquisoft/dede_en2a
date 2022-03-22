import multer from "multer";

const storage = multer.diskStorage({
  destination: "../webapp/src/images",
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase()); //+ path.extname(file.originalname).toLowerCase()
  }, 
});

const diskUpload = multer({
  storage: storage,
  limits: {
     fileSize: 8000000
  }
});

export default multer({ storage });
