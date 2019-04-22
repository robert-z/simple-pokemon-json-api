# Simple Pokémon JSON API

* [🤔 Project explanation](#-project-explanation)
* [🚀 Environment setup](#-environment-setup)
* [🤓 API Documentation](#-api-documentation)

## 🤔 Project explanation

This simple Pokémon API has been created to be used in APIs introduction lessons in Skylab Coders Academy.

We need to have access to an API not connected to a online database, for this reason we scraped [pokémondb.net](https://pokemondb.net) website and saved the needed info of all Pokémons in a JSON file.

## 🚀 Environment setup

1. [Install Docker](https://www.docker.com/get-started) 
2. Clone this project: `git clone https://github.com/robert-z/simple-pokemon-json-api.git`
3. Move to the project folder: `cd simple-json-pokeapi`
4. Copy the default environment variables: `cp .env.dist .env`
5. Add `api.pokemon.dev` domain to your local hosts: `echo "127.0.0.1 api.pokemon.dev"| sudo tee -a /etc/hosts > /dev/null`
6. Run `docker-compose build`
7. Run `docker-compose up -d`

## 🤓 API Documentation

### Usage

Send all data requests to:

```
http://api.pokemon.dev:8080/api
```

### Endpoints

- `GET` /pokedex

- `GET` /pokedex/:name

- `GET` /pokedex/all

- `GET` /search


### Parameters

#### `GET` /pokedex

| Parameter     | Required      | Default Value  |
| ------------- |:-------------:| --------------:|
| page          | `No`          | 1              |
| perPage       | `No`          | 20             |

##### URL example
```
http://api.pokemon.dev:8080/api/pokedex?page=1&perPage=10
```

##### Return example
```json
{
    "data": [
        {
            "num": 1,
            "name": "Bulbasaur",
            "image": "http://api.pokemon.dev/images/bulbasaur.jpg"
        },
        ...
    ],
    "page": 1,
    "totalPages": 81,
    "totalResults": 809
}
```

---

#### `GET` /pokedex/:name

| Parameter     | Required      | Default Value  |
| ------------- |:-------------:| --------------:|
| name          | `Yes`         | `<empty>`      |

##### URL example
```
http://api.pokemon.dev:8080/api/pokedex/pikachu
```

##### Return example
```json
{
    "num": 25,
    "name": "Pikachu",
    "variations": [
        {
            "name": "Pikachu",
            "description": "Pikachu is an Electric type Pokémon introduced in Generation 1. It is known as the Mouse Pokémon.",
            "image": "http://api.pokemon.dev/images/pikachu.jpg",
            "types": [
                "Electric"
            ],
            "specie": "Mouse Pokémon",
            "height": 0.4,
            "weight": 6,
            "abilities": [
                "Static",
                "Lightning Rod"
            ],
            "stats": {
                "total": 320,
                "hp": 35,
                "attack": 55,
                "defense": 40,
                "speedAttack": 50,
                "speedDefense": 50,
                "speed": 90
            },
            "evolutions": [
                "pichu",
                "pikachu",
                "raichu"
            ]
        },
        {
            "name": "Partner Pikachu",
            "description": "Pikachu is an Electric type Pokémon introduced in Generation 1. It is known as the Mouse Pokémon.",
            "image": "http://api.pokemon.dev/images/pikachu-lets-go.jpg",
            "types": [
                "Electric"
            ],
            "specie": "Mouse Pokémon",
            "height": 0.4,
            "weight": 6,
            "abilities": [],
            "stats": {
                "total": 430,
                "hp": 45,
                "attack": 80,
                "defense": 50,
                "speedAttack": 75,
                "speedDefense": 60,
                "speed": 120
            },
            "evolutions": [
                "pichu",
                "pikachu",
                "raichu"
            ]
        }
    ],
    "link": "https://pokemondb.net/pokedex/pikachu"
}
```

---

#### `GET` /pokedex/all

##### URL example
```
http://api.pokemon.dev:8080/api/pokedex/all
```

##### Return example
```json
{
    "data": [
        {
            "num": 1,
            "name": "Bulbasaur",
            "image": "http://api.pokemon.dev/images/bulbasaur.jpg"
        },
        ...
    ]
}
```

---

#### `GET` /search

| Parameter     | Required      | Default Value  |
| ------------- |:-------------:| --------------:|
| query         | `Yes`         | `<empty>`      |
| page          | `No`          | 1              |
| perPage       | `No`          | 20             |

##### URL example
```
http://api.pokemon.dev:8080/api/search?query=pik&page=1&perPage=10
```

##### Return example
```json
{
    "data": [
        {
            "num": 25,
            "name": "Pikachu",
            "image": "http://api.pokemon.dev/images/pikachu.jpg"
        },
        ...
    ],
    "page": 1,
    "totalPages": 1,
    "totalResults": 6
}
```
