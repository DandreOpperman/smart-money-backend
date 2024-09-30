const format = require('pg-format');
const db = require('../connection');
// const { convertTimestampToDate } = require('../utils');

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
        savings_goal INT NOT NULL,
        date_joined DATE NOT NULL
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
        date DATE NOT NULL,
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
    });
};

module.exports = seed;
