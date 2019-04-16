"use strict";
var file = __dirname + "/../../data/pokemon.json";

const fs = require("fs");

const logic = {
  searchPokemonBy({ query = "", page = 1, perPage = 20 }) {
    page = Number(page);
    perPage = Number(perPage);
    if (typeof query !== "string") throw TypeError(`${query} is not a string`);
    if (!query.trim().length) throw Error(`query is empty or blank`);
    if (typeof page !== "number") throw TypeError(`${page} is not a number`);
    if (typeof perPage !== "number")
      throw TypeError(`${perPage} is not a number`);

    return (async () => {
      const pokemonsFile = fs.readFileSync(file, "utf8");
      const pokemons = JSON.parse(pokemonsFile);
      let results = [];

      const showFrom = perPage * (page - 1);
      const showTo = showFrom + perPage;

      for (var i = 0; i < pokemons.length; i++) {
        const pokemon = {};
        for (const key in pokemons[i]) {
          if (
            typeof pokemons[i][key] === "string" &&
            pokemons[i][key].indexOf(query) != -1
          ) {
            pokemon.num = pokemons[i].num;
            pokemon.name = pokemons[i].name;
            pokemon.icon = pokemons[i].icon;
            results.push(pokemon);
            results = [...new Set(results)];
          }
        }
      }

      return {
        data: results.slice(showFrom, showTo),
        page: page,
        totalPages: Math.ceil(results.length / perPage),
        totalResults: results.length
      };
    })();
  },

  getPokemons({ page = 1, perPage = 20 }) {
    page = Number(page);
    perPage = Number(perPage);
    if (typeof page !== "number") throw TypeError(`${page} is not a number`);
    if (typeof perPage !== "number")
      throw TypeError(`${perPage} is not a number`);

    return (async () => {
      const pokemonsFile = fs.readFileSync(file, "utf8");
      const pokemons = JSON.parse(pokemonsFile);

      const showFrom = perPage * (page - 1);
      const showTo = showFrom + perPage;

      const pokemonsList = pokemons.map(pokemon => {
        return {
          num: pokemon.num,
          name: pokemon.name,
          icon: pokemon.icon
        };
      });

      return {
        data: pokemonsList.slice(showFrom, showTo),
        page: page,
        totalPages: Math.ceil(pokemons.length / perPage),
        totalResults: pokemons.length
      };
    })();
  },

  getAllPokemons() {
    return (async () => {
      const pokemonsFile = fs.readFileSync(file, "utf8");
      const pokemons = JSON.parse(pokemonsFile);

      const pokemonsList = pokemons.map(pokemon => {
        return {
          num: pokemon.num,
          name: pokemon.name,
          icon: pokemon.icon
        };
      });

      return {
        data: pokemonsList
      };
    })();
  },

  getPokemonBy({ name }) {
    if (typeof name !== "string") throw TypeError(`${name} is not a string`);
    if (!name.trim().length) throw Error(`name is empty or blank`);

    return (async () => {
      let pokemons = fs.readFileSync(file, "utf8");

      let pokemon = JSON.parse(pokemons).filter(
        pok => pok.name.toLowerCase() === name.toLowerCase()
      );

      if (!pokemon[0]) throw Error(`Not Found`);

      return pokemon[0];
    })();
  }
};

module.exports = logic;
