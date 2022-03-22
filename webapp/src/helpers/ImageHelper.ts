export const checkImageExists = (image: string) => {
    let image_path = "";
    try {
      image_path = require("../images/" + image);
    } catch (err) {
      image_path = require("../images/not-found.png"); //set default image path
    }
    return image_path;
  };