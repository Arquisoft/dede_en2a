const jwt = require("jsonwebtoken");

export const generateToken = (webId: String) => {
  return jwt.sign({ webId }, process.env.JWT_SECRET || "testToken", {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: String, webId: String) => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET || "testToken");
    if (decoded.webId === webId) return true;
    else return false;
  } catch (error) {
    console.log("Not a valid token :(");
    return false;
  }
};
