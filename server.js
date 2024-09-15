const express = require("express");
const dotenv = require("dotenv");
const dbInit = require("./config/dbInit");
const verifyJWT = require("./middlewares/verifyJWT");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// Cross Origin Resource Sharing
const whitelist = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://localhost:5173",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();

const PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));

app.use(verifyJWT);
app.use("/geo", require("./routes/geo"));

dbInit()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });
