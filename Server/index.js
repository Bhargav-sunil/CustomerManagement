const express = require("express");
const cors = require("cors");
const dotEnv = require("dotenv");
const createTables = require("./models/createTables");

const customerRoutes = require("./routes/customerRoutes");
const addressRoutes = require("./routes/addressRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB tables
createTables();

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api", addressRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
