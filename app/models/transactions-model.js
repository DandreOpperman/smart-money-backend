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
