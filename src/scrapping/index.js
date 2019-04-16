// External dependencies

const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
const fs = require("fs");

const url = "https://pokemondb.net";
const urlAllPokemon = `${url}/pokedex/all`;
const outputFile = __dirname + "/../../data/pokemon.json";

console.log(
  chalk.yellow.bgBlue(
    `\n  Scraping of ${chalk.underline.bold(urlAllPokemon)} initiated...\n`
  )
);

const getDetail = ($, tabsetBasics, tab = 0) => {
  const tabList = tabsetBasics.children(".tabs-tab-list").eq(0);

  const tabsPanel = tabsetBasics
    .children(".tabs-panel-list")
    .eq(0)
    .children(".tabs-panel")
    .eq(tab);

  const name = $(".tabs-tab", tabList)
    .eq(tab)
    .text();

  const description = $(".grid-row")
    .eq(0)
    .find("div")
    .text()
    .trim();

  const image = $("img", tabsPanel).attr("src");

  const types = [];
  $(".vitals-table .type-icon", tabsPanel).each((i, e) => {
    types[i] = $(e).text();
  });

  const specie = $(".vitals-table tr", tabsPanel)
    .eq(2)
    .find("td")
    .text();
  const height = $(".vitals-table tr", tabsPanel)
    .eq(3)
    .find("td")
    .text();
  const weight = $(".vitals-table tr", tabsPanel)
    .eq(4)
    .find("td")
    .text();

  const abilities = [];
  $(".vitals-table tr", tabsPanel)
    .eq(5)
    .find(".text-muted a")
    .each((i, e) => {
      abilities[i] = $(e).text();
    });

  const statsBlock = $("#dex-stats", tabsPanel).parent();
  const statsTableTr = $(".vitals-table", statsBlock);

  const stats = {};

  stats.total = $("tr", statsTableTr)
    .eq(6)
    .find("td")
    .text();

  stats.hp = $("tr", statsTableTr)
    .eq(0)
    .find("td")
    .eq(0)
    .text();

  stats.attack = $("tr", statsTableTr)
    .eq(1)
    .find("td")
    .eq(0)
    .text();

  stats.defense = $("tr", statsTableTr)
    .eq(2)
    .find("td")
    .eq(0)
    .text();

  stats.speedAttack = $("tr", statsTableTr)
    .eq(3)
    .find("td")
    .eq(0)
    .text();

  stats.speedDefense = $("tr", statsTableTr)
    .eq(4)
    .find("td")
    .eq(0)
    .text();

  stats.speed = $("tr", statsTableTr)
    .eq(5)
    .find("td")
    .eq(0)
    .text();

  let icon;

  const evolutionsBlock = $(".infocard-list-evo").children(".infocard ");
  const evolutions = [];
  evolutionsBlock.each((i, e) => {
    const evoName = $(".ent-name", e)
      .text()
      .toLowerCase();
    if (evoName) {
      if (evoName === name.toLowerCase()) {
        icon = $(".img-sprite", e).attr("data-src");
      }
      evolutions.push(evoName);
    }
  });

  return {
    name,
    description,
    icon,
    image,
    types,
    specie,
    height,
    weight,
    abilities,
    stats,
    evolutions
  };
};

const pokemonDetail = async url => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const tabsetBasics = $(".tabset-basics").eq(0);

    const details = getDetail($, tabsetBasics, 0);

    const tabPanelList = tabsetBasics.children(".tabs-panel-list").eq(0);

    const mega = [];
    tabPanelList
      .children(".tabs-panel")
      .not(".active")
      .map((i, el) => {
        mega[i] = getDetail($, tabsetBasics, i + 1);
        delete mega[i].description;
      });

    return { ...details, mega };
  } catch (error) {
    console.error(error);
  }
};

const getPokemonList = async url => {
  try {
    const response = await axios.get(`${url}/pokedex/all`);

    const $ = cheerio.load(response.data);

    const pokemons = $("#pokedex tbody tr");

    const pokemonPromises = pokemons
      .not((i, el) => {
        return $(".text-muted", el).length > 0;
      })
      .map(async (i, el) => {
        const num = $(".infocard-cell-data", el).text();

        const link = $(".ent-name", el).attr("href");

        const details = await pokemonDetail(url + link);

        const pokemon = {
          num,
          link: url + link
        };

        return { ...pokemon, ...details };
      });

    return Promise.all(pokemonPromises.get());
  } catch (error) {
    console.error(error);
  }
};

const results = Promise.resolve(getPokemonList(url)).then(res => {
  fs.writeFile(outputFile, JSON.stringify(res, null, 4), err => {
    if (err) {
      console.log(err);
    }
    console.log(
      chalk.yellow.bgBlue(
        `\n ${chalk.underline.bold(
          res.length
        )} Results exported successfully to ${chalk.underline.bold(
          outputFile
        )}\n`
      )
    );
  });
});
