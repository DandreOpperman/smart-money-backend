const { comparePass } = require("../models/login-model");

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  comparePass(email, password)
    .then(({ user_id }) => {
      res.status(200).send({ user_id });
    })
    .catch((err) => next(err));
};
