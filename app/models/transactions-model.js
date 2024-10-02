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
