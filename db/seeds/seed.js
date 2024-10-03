const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("../utils");

const seed = ({
  userData,
  monthlyExpenseData,
  transactionData,
  tagData,
  goalData,
}) => {
  return db
    .query(`DROP EXTENSION IF EXISTS pgcrypto CASCADE;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS transactions_tags;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS transactions;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS goals;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS monthly_expenses;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`CREATE EXTENSION pgcrypto;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(40) NOT NULL,
        password VARCHAR(150) NOT NULL,
        avatar_url VARCHAR(150) DEFAULT 'https://cdn-icons-png.flaticon.com/512/6097/6097300.png',
        fname VARCHAR(40) NOT NULL,
        income FLOAT DEFAULT 0,
        savings_target FLOAT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`);
      // user_id	        email	        password	        fname	            income	        savings_goal	date_joined
      // SERIAL PRIMARY KEY	varchar, not null	varchar, not null	varchar, not null	int, not null	int, not null	DATE, not null
    })
    .then(() => {
      return db.query(`
      CREATE TABLE monthly_expenses (
        monthly_expense_id SERIAL PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
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
        name VARCHAR(40) NOT NULL,
        cost FLOAT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        img_url VARCHAR(300),
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
      return db.query(`
      CREATE TABLE goals (
        goal_id SERIAL PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        cost FLOAT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        img_url VARCHAR(300),
        description VARCHAR(500),
        user_id INT REFERENCES users(user_id) NOT NULL
      );`);
    })
    .then(() => {
      const formattedUserData = userData.map(convertTimestampToDate);
      const insertUsersQueryStr = format(
        "INSERT INTO users (email, password, fname, income, savings_target, created_at) VALUES %L;",
        formattedUserData.map(
          ({ email, password, fname, income, savings_target, created_at }) => [
            email,
            password,
            fname,
            income,
            savings_target,
            created_at,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      return db.query(`
      UPDATE users
      SET income = 0, savings_target = 0
      WHERE income IS NULL OR savings_target IS NULL;
      `);
    })
    .then(() => {
      return db.query(`
      UPDATE users
      SET created_at = NOW()
      WHERE created_at IS NULL;
      `);
    })
    .then(() => {
      const insertMonthlyExpensesQueryStr = format(
        "INSERT INTO monthly_expenses (user_id, name, cost) VALUES %L;",
        monthlyExpenseData.map(({ user_id, name, cost }) => [
          user_id,
          name,
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
        "INSERT INTO transactions (user_id, name, cost, created_at, img_url, description) VALUES %L;",
        formattedTransactionData.map(
          ({ user_id, name, cost, created_at, img_url, description }) => [
            user_id,
            name,
            cost,
            created_at,
            img_url,
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
    })
    .then(() => {
      const formattedGoalData = goalData.map(convertTimestampToDate);
      const insertGoalsQueryStr = format(
        "INSERT INTO goals (user_id, name, cost, created_at, img_url, description) VALUES %L;",
        formattedGoalData.map(
          ({ user_id, name, cost, created_at, img_url, description }) => [
            user_id,
            name,
            cost,
            created_at,
            img_url,
            description,
          ]
        )
      );
      return db.query(insertGoalsQueryStr);
    });
};

module.exports = seed;
