const transactionsRouter = require("express").Router({ mergeParams: true });
const {
  getTransactions,
  deleteTransaction,
  deleteAllTransactions,
} = require("../controllers/transactions-controller");

transactionsRouter.get("/", getTransactions);
transactionsRouter.delete("/", deleteAllTransactions);
transactionsRouter.delete("/:transaction_id", deleteTransaction);

module.exports = transactionsRouter;
