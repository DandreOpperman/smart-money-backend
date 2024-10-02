const {
  selectUser,
  insertUser,
  updateUser,
  removeUser,
} = require("../models/user-model");

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
exports.patchUser = (req, res, next) => {
  const patchBody = req.body;
  const { user_id } = req.params;
  updateUser(user_id, patchBody)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => next(err));
};
exports.deleteUser = (req, res, next) => {
  const { user_id } = req.params;
  removeUser(user_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
