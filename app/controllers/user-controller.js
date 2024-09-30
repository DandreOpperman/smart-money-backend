const { selectUser } = require("../models/user-model");

exports.getUser = (req, res) => {
  const { user_id } = req.params;
  selectUser(user_id).then((user) => {
    res.status(200).send({ user });
  });
  // .catch((err) => next(err));
};
