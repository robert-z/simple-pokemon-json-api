'use strict'

require("dotenv").config();

const express = require("express");
const pack = require("../package.json");
const router = require("./routes");
const cors = require("cors");

const {
  env: { PORT }
} = process;

const app = express();

app.use(cors());

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`${pack.name} ${pack.version} up and running on port ${PORT}`)
);
