const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("../utils");

const seed = ({ userData, monthlyExpenseData, transactionData, tagData }) => {
  return db
    .query(`DROP TABLE IF EXISTS transactions_tags;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS transactions;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS monthly_expenses;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(40) NOT NULL,
        password VARCHAR(40) NOT NULL,
        fname VARCHAR(40) NOT NULL,
        income INT NOT NULL,
        savings_target INT NOT NULL,
        created_at DATE NOT NULL
      );`);
      // user_id	        username	        password	        fname	            income	        savings_goal	date_joined
      // SERIAL PRIMARY KEY	varchar, not null	varchar, not null	varchar, not null	int, not null	int, not null	DATE, not null
    })
    .then(() => {
      return db.query(`
      CREATE TABLE monthly_expenses (
        monthly_expense_id SERIAL PRIMARY KEY,
        expense_name VARCHAR(40) NOT NULL,
        cost FLOAT NOT NULL,
        user_id INT REFERENCES users(user_id) NOT NULL
      );`);
      // monthly_expense_id ||	expense_name	    || cost            ||	user_id
      // SERIAL PRIMARY KEY ||	varchar, not null	|| float, not null ||	int FOREIGN KEY
    })
    .then(() => {
      return db.query(`
      CREATE TABLE transactions (
        transaction_id SERIAL PRIMARY KEY,
        expense_name VARCHAR(40) NOT NULL,
        cost FLOAT NOT NULL,
        created_at DATE NOT NULL,
        description VARCHAR(500),
        user_id INT REFERENCES users(user_id) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE transactions_tags (
        transaction_tag_id SERIAL PRIMARY KEY,
        tag_name VARCHAR(40),
        transaction_id INT REFERENCES transactions(transaction_id) NOT NULL
      );`);
    })
    .then(() => {
      const formattedUserData = userData.map(convertTimestampToDate);
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, password, fname, income, savings_target, created_at) VALUES %L;",
        formattedUserData.map(
          ({
            username,
            password,
            fname,
            income,
            savings_target,
            created_at,
          }) => [username, password, fname, income, savings_target, created_at]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertMonthlyExpensesQueryStr = format(
        "INSERT INTO monthly_expenses (user_id, expense_name, cost) VALUES %L;",
        monthlyExpenseData.map(({ user_id, expense_name, cost }) => [
          user_id,
          expense_name,
          cost,
        ])
      );
      return db.query(insertMonthlyExpensesQueryStr);
    })
    .then(() => {
      const formattedTransactionData = transactionData.map(
        convertTimestampToDate
      );
      const insertTransactionQueryStr = format(
        "INSERT INTO transactions (user_id, expense_name, cost, created_at, description) VALUES %L;",
        formattedTransactionData.map(
          ({ user_id, expense_name, cost, created_at, description }) => [
            user_id,
            expense_name,
            cost,
            created_at,
            description,
          ]
        )
      );
      return db.query(insertTransactionQueryStr);
    })
    .then(() => {
      const insertTransactionsTagsQueryStr = format(
        "INSERT INTO transactions_tags (transaction_id, tag_name) VALUES %L;",
        tagData.map(({ transaction_id, tag_name }) => [
          transaction_id,
          tag_name,
        ])
      );
      return db.query(insertTransactionsTagsQueryStr);
    });
};

module.exports = seed;
