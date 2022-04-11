export const checkImageExists = (image: string) => {
  let image_path = "";
  try {
    image_path =
      process.env.REACT_APP_API_URI || "http://localhost:5000" + "/" + image;
  } catch (err) {
    image_path =
      process.env.REACT_APP_API_URI ||
      "http://localhost:5000" + "/not-found.png"; //set default image path
  }
  return image_path;
};
