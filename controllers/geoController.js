const axios = require("axios");
const History = require("../db/models/History");

const handleGetGeoInfo = async (req, res) => {
  const { ip_address } = req.params;
  const user_id = req.user.id;
  console.log(user_id);
  if (!ip_address) {
    return res.status(400).json({ error: "IP address is required" });
  }

  try {
    const response = await axios.get(` https://ipinfo.io/${ip_address}/geo`);
    const geo_info = response.data;
    const existingHistory = await History.findByUserIdAndIp(
      user_id,
      ip_address
    );
    if (existingHistory.length === 0) {
      const history = await History.create({ user_id, ip_address, geo_info });
    }

    res.status(200).json({ geo_info, message: "Geo info retrieved" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const handleGetHistory = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const history = await History.findByUserId(user_id);
    res.status(200).json({ history, message: "History retrieved" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const handleDeleteHistory = async (req, res) => {
  const { ids } = req.body;
  if (!ids) {
    return res.status(400).json({ error: "IDs are required" });
  }
  try {
    const deletedCount = await History.deleteByIds(ids);
    res.status(200).json({ deletedCount, message: "History deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { handleGetGeoInfo, handleGetHistory, handleDeleteHistory };
