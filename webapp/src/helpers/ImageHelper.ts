export const checkImageExists = (image: string) => {
  return process.env.REACT_APP_API_URI || "http://localhost:5000" + "/" + image;
};
