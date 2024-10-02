const transactionsRouter = require("express").Router({ mergeParams: true });
const {
  getTransactions,
  deleteTransaction,
  deleteAllTransactions,
  postTransaction,
} = require("../controllers/transactions-controller");

transactionsRouter.get("/", getTransactions);
transactionsRouter.delete("/", deleteAllTransactions);
transactionsRouter.post("/", postTransaction);
transactionsRouter.delete("/:transaction_id", deleteTransaction);

module.exports = transactionsRouter;
