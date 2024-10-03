const { selectUserID } = require("../models/login-model");

exports.getUserID = (req, res, next) => {
  const { email } = req.params;
  selectUserID(email)
    .then((user_id) => {
      res.status(200).send(user_id);
    })
    .catch((err) => next(err));
};
