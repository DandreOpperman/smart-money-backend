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

exports.insertGoal = ({ name, cost, description, img_url }, user_id) => {
  return db
    .query(
      `
    INSERT INTO goals
        (name, cost, description, img_url, user_id)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [name, cost, description, img_url, user_id]
    )
    .then(({ rows: [goal] }) => {
      return goal;
    });
};

exports.removeAllGoals = (user_id) => {
  return db.query(
    `
    DELETE FROM goals
    WHERE user_id = $1;`,
    [user_id]
  );
};

exports.removeGoal = (user_id, goal_id) => {
  return db
    .query(
      `
    SELECT user_id FROM goals
    WHERE goal_id = $1;`,
      [goal_id]
    )
    .then(({ rows: [owner] }) => {
      if (owner.user_id !== +user_id) {
        return Promise.reject({ status: 400, msg: "BAD REQUEST" });
      }
    })
    .then(() => {
      return db.query(
        `
    DELETE FROM goals
    WHERE user_id = $1 AND goal_id = $2;`,
        [user_id, goal_id]
      );
    });
};
