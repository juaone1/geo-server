const jwt = require("jsonwebtoken");
const User = require("../db/models/User");
const dotenv = require("dotenv");
dotenv.config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookies", cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const userExists = await User.findByRefreshToken(refreshToken);
  if (!userExists) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err || userExists.email !== user.email) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { id: userExists[0]?.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
