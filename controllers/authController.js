const bcrypt = require("bcrypt");
const User = require("../db/models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const results = await User.findByEmail(email);
    if (results.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in the database
    await User.updateRefreshToken(user.id, refreshToken);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 86400000,
    });

    res.status(200).json({ accessToken, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { handleLogin };
