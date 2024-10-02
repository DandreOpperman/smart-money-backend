const db = require("../../db/connection");
const { checkValueExists } = require("../../db/utils");

exports.selectGoals = (user_id) => {
  return checkValueExists("users", "user_id", user_id)
    .then(() => {
      return db.query(
        `
    SELECT goal_id, name, cost, img_url, created_at, description, user_id 
    FROM goals
    WHERE user_id = $1;`,
        [user_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};
