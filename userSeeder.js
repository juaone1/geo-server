const bcrypt = require("bcrypt");
const User = require("./db/models/User");

const seedUser = async () => {
  const email = "test@example.com";
  const password = "password123";

  const hashedPassword = bcrypt.hashSync(password, 10);
  await User.create({ email, password: hashedPassword });
  console.log("User seeded");
};

seedUser().catch((err) => console.error("Error seeding user:", err));
