const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyJWT = (req, res, next) => {
  const token =
    req.header("Authorization")?.split(" ")[1] || req.header("Authorization");
  console.log("verifyJWT token", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded", decoded);
    req.user = decoded; // Attach user information to request object
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = verifyJWT;
