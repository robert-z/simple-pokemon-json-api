"use strict";

const logic = {
  __pokemons__: null,

  searchPokemonBy({ query = "", page = 1, perPage = 20 }) {
    page = Number(page);
    perPage = Number(perPage);

    if (typeof query !== "string") throw TypeError(`${query} is not a string`);
    if (!query.trim().length) throw Error(`query is empty or blank`);
    if (typeof page !== "number") throw TypeError(`${page} is not a number`);
    if (typeof perPage !== "number")
      throw TypeError(`${perPage} is not a number`);

    return (async () => {
      let results = [];

      const showFrom = perPage * (page - 1);
      const showTo = showFrom + perPage;

      for (let i = 0; i < this.__pokemons__.length; i++) {
        const pokemon = {};
        const variation = this.__pokemons__[i].variations[0];

        for (const key in variation) {
          if (
            typeof variation[key] === "string" &&
            variation[key].indexOf(query) != -1
          ) {
            pokemon.num = this.__pokemons__[i].num;
            pokemon.name = this.__pokemons__[i].name;
            pokemon.image = variation.image;
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

    const showFrom = perPage * (page - 1);
    const showTo = showFrom + perPage;

    return (async () => {
      const pokemonsList = this.mapListPokemon(this.__pokemons__);

      return {
        data: pokemonsList.slice(showFrom, showTo),
        page: page,
        totalPages: Math.ceil(this.__pokemons__.length / perPage),
        totalResults: this.__pokemons__.length
      };
    })();
  },

  getAllPokemons() {
    return (async () => {
      return {
        data: this.mapListPokemon(this.__pokemons__)
      };
    })();
  },

  getPokemonBy({ name }) {
    if (typeof name !== "string") throw TypeError(`${name} is not a string`);
    if (!name.trim().length) throw Error(`name is empty or blank`);

    return (async () => {
      let pokemon = this.__pokemons__.find(
        pokemon => pokemon.name.toLowerCase() === name.toLowerCase()
      );

      if (!pokemon) throw Error(`Pokémon not found`);

      return pokemon;
    })();
  },

  mapListPokemon(pokemons) {
    return pokemons.map(pokemon => {
      return {
        num: pokemon.num,
        name: pokemon.name,
        image: pokemon.variations[0].image
      };
    });
  }
};

module.exports = logic;
