const { selectUser, insertUser } = require("../models/user-model");

exports.getUser = (req, res, next) => {
  const { user_id } = req.params;
  selectUser(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => next(err));
};
exports.postUser = (req, res, next) => {
  const newUser = req.body;
  insertUser(newUser)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => next(err));
};
