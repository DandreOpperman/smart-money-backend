const jwt = require("jsonwebtoken");

exports.generateToken = (tokenData, jwt_expire) => {
  return jwt.sign(
    tokenData,
    "8e7df9138eb9ad5778b6aeb20aff020a7d7c724ac7a24da7ced4fdbdd1e22065", //REAL-WORLD: process.env.JWT_SECRET
    { expiresIn: jwt_expire }
  );
};
