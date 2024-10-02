const { selectTransactions } = require("../models/transactions-model");

exports.getTransactions = (req, res, next) => {
  const { user_id } = req.params;
  selectTransactions(user_id)
    .then((transactions) => {
      res.status(200).send({ transactions });
    })
    .catch((err) => next(err));
};
