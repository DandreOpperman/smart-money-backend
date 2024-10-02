const db = require("../../db/connection");

exports.selectTransactions = (user_id) => {
  return db
    .query(
      `
    SELECT transaction_id, name, cost, img_url, created_at, user_id FROM transactions
    WHERE user_id = $1;`,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
