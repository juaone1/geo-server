const express = require("express");
const dotenv = require("dotenv");
const dbInit = require("./config/dbInit");
const verifyJWT = require("./middlewares/verifyJWT");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3500;

app.use(express.json());

//routes
app.use("/login", require("./routes/auth"));
app.use(verifyJWT);
app.use("/geo", require("./routes/geo"));

dbInit()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });
