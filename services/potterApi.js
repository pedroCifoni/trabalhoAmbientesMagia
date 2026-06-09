const fetch = require('node-fetch');

const BASE_URL = 'https://api.potterdb.com/v1';

async function fetchCharacters(pageSize, pageNumber) {
  const response = await fetch(`${BASE_URL}/characters?page[size]=${pageSize}&page[number]=${pageNumber}`);
  const result = await response.json();
  return result.data;
}

async function fetchSpells(pageSize) {
  const response = await fetch(`${BASE_URL}/spells?page[size]=${pageSize}`);
  const result = await response.json();
  return result.data;
}

module.exports = {
  fetchCharacters,
  fetchSpells,
};
