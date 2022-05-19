const db = require("../db/connection.js");

//1.GET/users
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((users) => {
    return users.rows;
  });
};
