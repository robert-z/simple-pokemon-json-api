// External dependencies
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
const fs = require("fs");

const url = "https://pokemondb.net";
const outputFile = __dirname + "/../../data/pokemon.json";

const getDetail = async ({ $, variation, tab, panelList }) => {
  const tabsPanel = panelList.children(".tabs-panel").eq(tab);

  const description = $(".grid-row")
    .eq(0)
    .find("div")
    .text()
    .trim();

  const pokemonImageUrl = $("img", tabsPanel).attr("src");
  let fileName = pokemonImageUrl.split("/");
  fileName = fileName[fileName.length - 1];
  const image = "images/" + fileName;
  await downloadImage(pokemonImageUrl, fileName, "image");

  const evolutionsBlock = $(".infocard-list-evo").children(".infocard ");
  const evolutions = [];
  evolutionsBlock.each((i, e) => {
    const evoName = $(".ent-name", e)
      .text()
      .toLowerCase();

    if (evoName) {
      const isAlolan =
        $(".ent-name", e)
          .parent()
          .children("small").length > 2;

      if (!isAlolan) {
        evolutions.push(evoName);
      }
    }
  });

  const types = [];
  $(".vitals-table .type-icon", tabsPanel).each((i, e) => {
    types.push($(e).text());
  });

  const specie = $(".vitals-table tr", tabsPanel)
    .eq(2)
    .find("td")
    .text();

  const regExp = /\-?\d+\.\d+/g;

  const heights = $(".vitals-table tr", tabsPanel)
    .eq(3)
    .find("td")
    .text()
    .match(regExp);
  const height = Number(heights[heights.length - 1]);

  const weights = $(".vitals-table tr", tabsPanel)
    .eq(4)
    .find("td")
    .text()
    .match(regExp);
  const weight = Number(weights[weights.length - 1]);

  const abilities = [];
  $(".vitals-table tr", tabsPanel)
    .eq(5)
    .find(".text-muted a")
    .each((i, e) => {
      abilities.push($(e).text());
    });

  const statsBlock = $("#dex-stats", tabsPanel).parent();
  const statsTableTr = $(".vitals-table", statsBlock);

  const stats = {};

  stats.total = Number(
    $("tr", statsTableTr)
      .eq(6)
      .find("td")
      .text()
  );

  stats.hp = Number(
    $("tr", statsTableTr)
      .eq(0)
      .find("td")
      .eq(0)
      .text()
  );

  stats.attack = Number(
    $("tr", statsTableTr)
      .eq(1)
      .find("td")
      .eq(0)
      .text()
  );

  stats.defense = Number(
    $("tr", statsTableTr)
      .eq(2)
      .find("td")
      .eq(0)
      .text()
  );

  stats.speedAttack = Number(
    $("tr", statsTableTr)
      .eq(3)
      .find("td")
      .eq(0)
      .text()
  );

  stats.speedDefense = Number(
    $("tr", statsTableTr)
      .eq(4)
      .find("td")
      .eq(0)
      .text()
  );

  stats.speed = Number(
    $("tr", statsTableTr)
      .eq(5)
      .find("td")
      .eq(0)
      .text()
  );

  return Promise.resolve({
    name: variation ? variation : null,
    description,
    image,
    types,
    specie,
    height,
    weight,
    abilities,
    stats,
    evolutions
  });
};

const pokemonDetail = async ({ pokemonLink }) => {
  try {
    const response = await axios.get(pokemonLink);

    const $ = cheerio.load(response.data);

    const tabsetBasics = $(".tabset-basics").eq(0);

    const tabList = tabsetBasics.children(".tabs-tab-list").eq(0);

    const panelList = tabsetBasics.children(".tabs-panel-list").eq(0);

    let tab = 0;

    const pokDetail = tabList.find(".tabs-tab").map(async (i, e) => {
      const name = $(e).text();

      tab = i;

      return await getDetail({
        $,
        variation: name,
        tab,
        panelList
      });
    });

    return Promise.all(pokDetail.get());

  } catch (error) {
    console.error(error);
  }
};

const pokemonListDetail = async ({ $, el, num, url }) => {
  if (num > 0 && num <= 150) {
    const name = $(".ent-name", el).text();

    const variation = $(".text-muted", el).text();

    const link = $(".ent-name", el).attr("href");

    const pokemonLink = url + link;

    const pokemon = await pokemonDetail({ pokemonLink });

    return { num, name, variations: pokemon, link: pokemonLink };
  }
};

const getPokemonList = async ({ url }) => {
  try {
    const response = await axios.get(`${url}/pokedex/all`);

    const $ = cheerio.load(response.data);

    const pokemons = $("#pokedex tbody tr");

    let pokNums = [];

    let pokemonsResult = [];

    const pokemonPromises = pokemons.map(async (i, el) => {
      const num = Number($(".infocard-cell-data", el).text());

      if (pokNums.indexOf(num) === -1) {
        pokNums.push(num);

        const pokemon = await pokemonListDetail({ $, el, num, url });

        pokemonsResult.push(pokemon);

        return pokemon;
      }
    });

    return Promise.all(pokemonPromises.get()).then(() => {
      return pokemonsResult.sort(function(a, b) {
        return a.num - b.num;
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const downloadImage = async (url, fileName, type = "image") => {
  const writer = fs.createWriteStream(
    `${__dirname}/../../public/images/${type}/${fileName}`
  );

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

Promise.resolve(getPokemonList({ url })).then(res => {
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
