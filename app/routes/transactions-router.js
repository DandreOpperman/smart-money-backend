const transactionsRouter = require("express").Router({ mergeParams: true });
const { getTransactions } = require("../controllers/transactions-controller");

transactionsRouter.get("/", getTransactions);

module.exports = transactionsRouter;
