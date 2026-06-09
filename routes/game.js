const express = require('express');
const { fetchCharacters } = require('../services/potterApi');
const { calculateCharacterStats } = require('../services/statsCalculator');
const { shuffleArray } = require('../utils/shuffle');
const constants = require('../constants');

const router = express.Router();

router.post('/cpu-deck', async (req, res) => {
  try {
    const randomPage = Math.floor(Math.random() * constants.TOTAL_PAGES) + 1;
    const charactersData = await fetchCharacters(constants.PAGE_SIZE, randomPage);

    const validCharacters = [];
    for (let index = 0; index < charactersData.length; index += 1) {
      const character = charactersData[index];
      const { attributes } = character;
      if (attributes.name && attributes.name !== '' && attributes.image) {
        const stats = calculateCharacterStats(attributes);
        validCharacters.push({
          id: character.id,
          name: attributes.name,
          house: attributes.house || 'Unknown',
          species: attributes.species || 'Unknown',
          ancestry: attributes.ancestry || 'Unknown',
          image: attributes.image,
          power: stats.power,
          magic: stats.magic,
          defense: stats.defense,
          hp: stats.hp,
          maxHp: stats.maxHp,
        });
      }
    }

    const shuffledCharacters = shuffleArray(validCharacters);
    res.json({ deck: shuffledCharacters.slice(0, constants.CPU_DECK_SIZE) });
  } catch (error) {
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

module.exports = router;
