"use strict";

require("dotenv").config();

const express = require("express");
const pack = require("../package.json");
const router = require("./routes");
const cors = require("cors");
const fs = require("fs");
const logic = require("./logic");

const {
  env: { PORT, BASE_URL }
} = process;

var file = __dirname + "/../data/pokemon.json";
const pokemonsFile = fs.readFileSync(file, "utf8");
const pokemons = JSON.parse(pokemonsFile);
pokemons.forEach(pokemon => {
  pokemon.variations.forEach(variation => {
    variation.image = BASE_URL + variation.image;
  });
});

logic.__pokemons__ = pokemons;

const app = express();

app.use(express.static("public"));

app.use(cors());

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`${pack.name} ${pack.version} up and running on port ${PORT}`)
);
