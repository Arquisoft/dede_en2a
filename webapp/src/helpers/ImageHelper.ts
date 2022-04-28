export const checkImageExists = (image: string) => {
  return (
    (process.env.REACT_APP_API_URI || "http://localhost:5000") + "/" + image
  );
};

export const checkPDF = (image: string) => {
  return (
    (process.env.REACT_APP_API_URI || "http://localhost:5000") + "/" + image
  );
};

export const checkImageExistsLocally = (image: string) => {
  let image_path = "";
  try {
    image_path = require("../images/" + image);
  } catch (err) {
    image_path = require("../images/not-found.png"); //set default image path
  }
  return image_path;
};
