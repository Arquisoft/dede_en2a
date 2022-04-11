export const checkImageExists = (image: string) => {
  let image_path = "";
  try {
    image_path = require(process.env.REACT_APP_API_URI + "/" + image);
  } catch (err) {
    image_path = require(process.env.REACT_APP_API_URI +
      "/not-found.png"); //set default image path
  }
  return image_path;
};
