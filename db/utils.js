const format = require("pg-format");
const db = require("./connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.checkValueExists = (table_name, column_name, value) => {
  queryParams = [column_name, table_name];
  let queryStr = `SELECT %I FROM %I`;
  if (value) {
    queryStr += ` WHERE %I = $1`;
    queryParams.push(column_name);
  }
  queryStr += ";";
  const formattedQueryStr = format(queryStr, ...queryParams);
  return db.query(formattedQueryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `NOT FOUND`,
      });
    }
  });
};
exports.checkValueTaken = (table_name, column_name, value, user_id) => {
  queryParams = [column_name, table_name];
  queryArgs = [];
  let queryStr = `SELECT %I FROM %I WHERE`;
  if (value) {
    queryStr += ` %I = $1 AND`;
    queryParams.push(column_name);
    queryStr += " user_id = $2;";
    queryParams.push(user_id);
    queryArgs.push(value);
    queryArgs.push(user_id);
  } else {
    queryStr += " user_id = $1;";
    queryParams.push(user_id);
    queryArgs.push(user_id);
  }

  const formattedQueryStr = format(queryStr, ...queryParams);
  return db.query(formattedQueryStr, queryArgs).then(({ rows }) => {
    if (rows.length) {
      return Promise.reject({
        status: 409,
        msg: `ALREADY EXISTS`,
      });
    }
  });
};
