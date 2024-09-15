const pool = require("../../config/db");

const History = {
  create: async (history) => {
    const query =
      "INSERT INTO history (user_id, ip_address, geo_info) VALUES ($1, $2, $3) RETURNING *";
    const values = [history.user_id, history.ip_address, history.geo_info];
    const res = await pool.query(query, values);
    return res.rows[0];
  },
  findByUserId: async (user_id) => {
    const query = "SELECT * FROM history WHERE user_id = $1";
    const res = await pool.query(query, [user_id]);
    return res.rows;
  },
  findByUserIdAndIp: async (user_id, ip_address) => {
    const query =
      "SELECT * FROM history WHERE user_id = $1 AND ip_address = $2";
    const res = await pool.query(query, [user_id, ip_address]);
    return res.rows;
  },
  deleteByIds: async (ids) => {
    const query = "DELETE FROM history WHERE id = ANY($1::int[])";
    const res = await pool.query(query, [ids]);
    return res.rowCount;
  },
};

module.exports = History;
