const express = require('express');
const { fetchSpells } = require('../services/potterApi');
const { calculateSpellDamage } = require('../services/statsCalculator');
const { shuffleArray } = require('../utils/shuffle');
const constants = require('../constants');

const router = express.Router();

router.get('/spells', async (req, res) => {
  try {
    const spellsData = await fetchSpells(constants.PAGE_SIZE);

    const validSpells = [];
    for (let index = 0; index < spellsData.length; index += 1) {
      const spell = spellsData[index];
      const { attributes } = spell;
      if (attributes.name && attributes.name !== '') {
        const damage = calculateSpellDamage(attributes.category);
        validSpells.push({
          id: spell.id,
          name: attributes.name,
          effect: attributes.effect || 'Efeito desconhecido',
          category: attributes.category || 'Spell',
          light: attributes.light || 'Unknown',
          damage,
        });
      }
    }

    const shuffledSpells = shuffleArray(validSpells);
    res.json({ spells: shuffledSpells.slice(0, constants.SPELLS_SIZE) });
  } catch (error) {
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

module.exports = router;
