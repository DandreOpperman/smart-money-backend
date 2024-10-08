const { user } = require("pg/lib/defaults");
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

exports.updateGoal = (patchBody, user_id, goal_id) => {
  const checkExists = [
    checkValueExists("goals", "goal_id", goal_id),
    checkValueExists("users", "user_id", user_id),
  ];
 
  return Promise.all(checkExists)
    .then(() => {
      const queryParams = [];
      const allowedColumns = ["name", "cost", "img_url", "description"];
      let count = Object.keys(patchBody).length;
      let queryStr = "UPDATE goals SET ";
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
      queryParams.unshift(user_id, goal_id);
      queryStr += `WHERE user_id = $1 AND goal_id = $2 RETURNING *;`;
      return db.query(queryStr, queryParams);
    })
    .then(({ rows: [goal] }) => {
      if (!goal) {
        console.log(rows);
        return Promise.reject({ status: 400, msg: "BAD REQUEST" });
      }
      return goal;
    });
};
