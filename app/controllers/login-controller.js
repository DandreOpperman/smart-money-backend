const { comparePass } = require("../models/login-model");
const { generateToken } = require("../services/login-service");

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  comparePass(email, password)
    .then((user_id) => {
      return generateToken(user_id, "1h");
    })
    .then((token) => {
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};
