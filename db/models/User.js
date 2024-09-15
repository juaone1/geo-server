const pool = require("../../config/db");

const User = {
  create: async (user) => {
    const query =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
    const values = [user.email, user.password];
    const res = await pool.query(query, values);
    return res.rows[0];
  },
  findByEmail: async (email) => {
    const query = "SELECT * FROM users WHERE email = $1";
    const res = await pool.query(query, [email]);
    return res.rows;
  },
  updateRefreshToken: async (userId, refreshToken) => {
    const query = "UPDATE users SET refresh_token = $1 WHERE id = $2";
    const values = [refreshToken, userId];
    const res = await pool.query(query, values);
    return res.rowCount; // Return the number of rows affected
  },
  findByRefreshToken: async (refreshToken) => {
    const query = "SELECT * FROM users WHERE refresh_token = $1";
    const res = await pool.query(query, [refreshToken]);
    return res.rows;
  },
};

module.exports = User;
