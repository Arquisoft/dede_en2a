const jwt = require ('jsonwebtoken')

export const generateToken = (email : String) => {
    return jwt.sign( { email }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
};