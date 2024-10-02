const {
  selectTransactions,
  removeTransaction,
  removeAllTransactions,
  insertTransaction,
  updateTransaction,
} = require("../models/transactions-model");

exports.getTransactions = (req, res, next) => {
  const { user_id } = req.params;
  selectTransactions(user_id)
    .then((transactions) => {
      res.status(200).send({ transactions });
    })
    .catch((err) => next(err));
};

exports.deleteTransaction = (req, res, next) => {
  const { user_id, transaction_id } = req.params;
  removeTransaction(user_id, transaction_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.deleteAllTransactions = (req, res, next) => {
  const { user_id } = req.params;
  removeAllTransactions(user_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.postTransaction = (req, res, next) => {
  const requestBody = req.body;
  const { user_id } = req.params;
  insertTransaction(requestBody, user_id)
    .then((transaction) => {
      res.status(201).send({ transaction });
    })
    .catch((err) => next(err));
};

exports.patchTransaction = (req, res, next) => {
  const requestBody = req.body;
  const { user_id, transaction_id } = req.params;
  updateTransaction(requestBody, user_id, transaction_id)
    .then((transaction) => {
      res.status(200).send({ transaction });
    })
    .catch((err) => next(err));
};
