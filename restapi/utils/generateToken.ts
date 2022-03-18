const jwt = require("jsonwebtoken");

export const generateToken = (email: String) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: String, email: String) => {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email === email) return true;
    else return false;
  } catch (error) {
      console.log("Ese token no valido manin")
      return false;
  }
};
