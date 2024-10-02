const db = require("../../db/connection");
const { checkValueExists } = require("../../db/utils");

exports.selectTransactions = (user_id) => {
  return checkValueExists("users", "user_id", user_id)
    .then(() => {
      return db.query(
        `
    SELECT transaction_id, name, cost, img_url, created_at, user_id FROM transactions
    WHERE user_id = $1;`,
        [user_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.removeTransaction = (user_id, transaction_id) => {
  return db
    .query(
      `
    SELECT user_id FROM transactions
    WHERE transaction_id = $1;`,
      [transaction_id]
    )
    .then(({ rows: [owner] }) => {
      if (owner.user_id !== +user_id) {
        return Promise.reject({ status: 400, msg: "BAD REQUEST" });
      }
    })
    .then(() => {
      return db.query(
        `
    DELETE FROM transactions_tags
    WHERE transaction_id = $1;`,
        [transaction_id]
      );
    })
    .then(() => {
      return db.query(
        `
    DELETE FROM transactions
    WHERE user_id = $1 AND transaction_id = $2;`,
        [user_id, transaction_id]
      );
    });
};

exports.removeAllTransactions = (user_id) => {
  return db
    .query(
      `
    DELETE FROM transactions_tags TT
    USING transactions TR
    WHERE TT.transaction_id = TR.transaction_id
    AND TR.user_id = $1;
    `,
      [user_id]
    )
    .then(() => {
      return db.query(
        `
    DELETE FROM transactions
    WHERE user_id = $1;`,
        [user_id]
      );
    });
};

exports.insertTransaction = ({ name, cost, description, img_url }, user_id) => {
  return db
    .query(
      `
    INSERT INTO transactions
        (name, cost, description, img_url, user_id)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [name, cost, description, img_url, user_id]
    )
    .then(({ rows: [transaction] }) => {
      return transaction;
    });
};

exports.updateTransaction = (patchBody, user_id, transaction_id) => {
  const checkExists = [
    checkValueExists("transactions", "transaction_id", transaction_id),
    checkValueExists("users", "user_id", user_id),
  ];
  return Promise.all(checkExists)
    .then(() => {
      const queryParams = [];
      const allowedColumns = ["name", "cost", "img_url", "description"];
      let count = Object.keys(patchBody).length;
      let queryStr = "UPDATE transactions SET ";
      for (const key in patchBody) {
        if (!allowedColumns.includes(key)) {
          return Promise.reject({ status: 400, msg: "BAD REQUEST" });
        }
        const value = patchBody[key];
        queryStr += `${key} = $${count + 2}`;
        queryParams.unshift(value);
        queryStr += count > 1 ? ", " : " ";
        count--;
      }
      queryParams.unshift(user_id, transaction_id);
      queryStr += `WHERE user_id = $1 AND transaction_id = $2 RETURNING *;`;
      return db.query(queryStr, queryParams);
    })
    .then(({ rows: [transaction] }) => {
      if (!transaction) {
        return Promise.reject({ status: 400, msg: "BAD REQUEST" });
      }
      return transaction;
    });
};
