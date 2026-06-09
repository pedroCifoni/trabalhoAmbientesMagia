const constants = require('../constants');

function calculateCharacterStats(attributes) {
  let power = constants.POWER_DEFAULT;
  if (attributes.house === 'Gryffindor') power = constants.POWER_GRYFFINDOR;
  if (attributes.house === 'Slytherin') power = constants.POWER_SLYTHERIN;
  if (attributes.house === 'Hufflepuff') power = constants.POWER_HUFFLEPUFF;
  if (attributes.house === 'Ravenclaw') power = constants.POWER_RAVENCLAW;

  let magic = constants.MAGIC_DEFAULT;
  if (attributes.species === 'human') magic = constants.MAGIC_HUMAN;
  if (attributes.species === 'half-giant') magic = constants.MAGIC_HALF_GIANT;
  if (attributes.species === 'giant') magic = constants.MAGIC_GIANT;
  if (attributes.species === 'house elf') magic = constants.MAGIC_HOUSE_ELF;
  if (attributes.species === 'ghost') magic = constants.MAGIC_GHOST;
  if (attributes.species === 'werewolf') magic = constants.MAGIC_WEREWOLF;
  if (attributes.species === 'vampire') magic = constants.MAGIC_VAMPIRE;
  if (attributes.species === 'centaur') magic = constants.MAGIC_CENTAUR;

  let defense = constants.DEFENSE_DEFAULT;
  if (attributes.ancestry === 'pure-blood') defense = constants.DEFENSE_PURE_BLOOD;
  if (attributes.ancestry === 'half-blood') defense = constants.DEFENSE_HALF_BLOOD;
  if (attributes.ancestry === 'muggle-born') defense = constants.DEFENSE_MUGGLE_BORN;
  if (attributes.ancestry === 'muggle') defense = constants.DEFENSE_MUGGLE;
  if (attributes.ancestry === 'squib') defense = constants.DEFENSE_SQUIB;

  const hp = defense + Math.floor(Math.random() * constants.HP_RANDOM_RANGE)
    + constants.HP_BASE_BONUS;

  return {
    power,
    magic,
    defense,
    hp,
    maxHp: hp,
  };
}

function calculateSpellDamage(category) {
  let damage = constants.DAMAGE_DEFAULT;
  if (category === 'Charm') damage = constants.DAMAGE_CHARM;
  if (category === 'Curse') damage = constants.DAMAGE_CURSE;
  if (category === 'Hex') damage = constants.DAMAGE_HEX;
  if (category === 'Jinx') damage = constants.DAMAGE_JINX;
  if (category === 'Spell') damage = constants.DAMAGE_SPELL;
  if (category === 'Transfiguration') damage = constants.DAMAGE_TRANSFIGURATION;
  if (category === 'Counter-spell') damage = constants.DAMAGE_COUNTER_SPELL;
  if (category === 'Healing spell') damage = constants.DAMAGE_HEALING;
  return damage;
}

module.exports = {
  calculateCharacterStats,
  calculateSpellDamage,
};
