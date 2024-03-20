const express = require("express");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes");
const connectDB = require("./services/database");

const app = express();
dotenv.config();
connectDB();

const cors = require("cors");
const corsOptions = {
  origin: "*",// Allow requests from any origin
  credentials: true, // Allow credentials to be sent with requests
  optionSuccessStatus: 200,
};

app.use(cors());

app.use(express.json());

app.use("/email", emailRoutes); //mounting the  routes at /email endpoint

app.get("/", (req, res) => {    // Route handler for the root endpoint
  res.send("Hello World!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {                           //server to listen on specific port
  console.log(`Server listening on port ${PORT}`);
});
