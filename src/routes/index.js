"use strict";
const express = require("express");
const logic = require("../logic");
const router = express.Router();

router.get("/search", (req, res) => {
  try {
    const { query, page, perPage } = req.query;

    return logic
      .searchPokemonBy({ query, page, perPage })
      .then(pokemons => {
        res.status(200);

        res.json(pokemons);
      })
      .catch(err => {
        res.status(404);
        res.json({
          error: err.message
        });
      });
  } catch (err) {
    res.status(400);

    res.json({
      error: err.message
    });
  }
});

router.get("/pokedex", (req, res) => {
  try {
    const { page, perPage } = req.query;

    return logic
      .getPokemons({page, perPage})
      .then(pokemons => {
        res.status(200);

        res.json(pokemons);
      })
      .catch(err => {
        res.status(404);
        res.json({
          error: err.message
        });
      });
  } catch (err) {
    res.status(400);

    res.json({
      error: err.message
    });
  }
});

router.get("/pokedex/all", (req, res) => {
  try {
    return logic
      .getAllPokemons()
      .then(pokemons => {
        res.status(200);

        res.json(pokemons);
      })
      .catch(err => {
        res.status(404);
        res.json({
          error: err.message
        });
      });
  } catch (err) {
    res.status(400);

    res.json({
      error: err.message
    });
  }
});

router.get("/pokedex/:name", (req, res) => {
  try {
    const { name } = req.params;

    return logic
      .getPokemonBy({ name })
      .then(duck => {
        res.status(200);

        res.json(duck);
      })
      .catch(err => {
        res.status(404);
        res.json({
          error: err.message
        });
      });
  } catch (err) {
    res.status(400);

    res.json({
      error: err.message
    });
  }
});

module.exports = router;
