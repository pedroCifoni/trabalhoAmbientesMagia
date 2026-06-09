const express = require('express');
const fetch = require('node-fetch');

const PAGE_SIZE = 100;
const TOTAL_PAGES = 8;
const PACK_SIZE = 4;
const CPU_DECK_SIZE = 2;
const SPELLS_SIZE = 20;
const PORT = 3000;

const POWER_DEFAULT = 50;
const POWER_GRYFFINDOR = 90;
const POWER_SLYTHERIN = 85;
const POWER_HUFFLEPUFF = 75;
const POWER_RAVENCLAW = 80;

const MAGIC_DEFAULT = 50;
const MAGIC_HUMAN = 70;
const MAGIC_HALF_GIANT = 88;
const MAGIC_GIANT = 95;
const MAGIC_HOUSE_ELF = 82;
const MAGIC_GHOST = 60;
const MAGIC_WEREWOLF = 91;
const MAGIC_VAMPIRE = 87;
const MAGIC_CENTAUR = 78;

const DEFENSE_DEFAULT = 50;
const DEFENSE_PURE_BLOOD = 90;
const DEFENSE_HALF_BLOOD = 75;
const DEFENSE_MUGGLE_BORN = 70;
const DEFENSE_MUGGLE = 40;
const DEFENSE_SQUIB = 35;

const HP_RANDOM_RANGE = 20;
const HP_BASE_BONUS = 80;

const DAMAGE_DEFAULT = 30;
const DAMAGE_CHARM = 45;
const DAMAGE_CURSE = 90;
const DAMAGE_HEX = 65;
const DAMAGE_JINX = 55;
const DAMAGE_SPELL = 50;
const DAMAGE_TRANSFIGURATION = 40;
const DAMAGE_COUNTER_SPELL = 35;
const DAMAGE_HEALING = -40;

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/api/pack', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    const d = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${PAGE_SIZE}&page[number]=${pg}`);
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i += 1) {
      const c = r.data[i];
      const a = c.attributes;
      if (a.name && a.name !== '' && a.image) {
        let pw = POWER_DEFAULT;
        if (a.house === 'Gryffindor') pw = POWER_GRYFFINDOR;
        if (a.house === 'Slytherin') pw = POWER_SLYTHERIN;
        if (a.house === 'Hufflepuff') pw = POWER_HUFFLEPUFF;
        if (a.house === 'Ravenclaw') pw = POWER_RAVENCLAW;

        let mg = MAGIC_DEFAULT;
        if (a.species === 'human') mg = MAGIC_HUMAN;
        if (a.species === 'half-giant') mg = MAGIC_HALF_GIANT;
        if (a.species === 'giant') mg = MAGIC_GIANT;
        if (a.species === 'house elf') mg = MAGIC_HOUSE_ELF;
        if (a.species === 'ghost') mg = MAGIC_GHOST;
        if (a.species === 'werewolf') mg = MAGIC_WEREWOLF;
        if (a.species === 'vampire') mg = MAGIC_VAMPIRE;
        if (a.species === 'centaur') mg = MAGIC_CENTAUR;

        let df = DEFENSE_DEFAULT;
        if (a.ancestry === 'pure-blood') df = DEFENSE_PURE_BLOOD;
        if (a.ancestry === 'half-blood') df = DEFENSE_HALF_BLOOD;
        if (a.ancestry === 'muggle-born') df = DEFENSE_MUGGLE_BORN;
        if (a.ancestry === 'muggle') df = DEFENSE_MUGGLE;
        if (a.ancestry === 'squib') df = DEFENSE_SQUIB;

        const hp = df + Math.floor(Math.random() * HP_RANDOM_RANGE) + HP_BASE_BONUS;

        const obj = {};
        obj.id = c.id;
        obj.name = a.name;
        obj.house = a.house || 'Unknown';
        obj.species = a.species || 'Unknown';
        obj.ancestry = a.ancestry || 'Unknown';
        obj.image = a.image;
        obj.power = pw;
        obj.magic = mg;
        obj.defense = df;
        obj.hp = hp;
        obj.maxHp = hp;

        tmp.push(obj);
      }
    }

    for (let x = tmp.length - 1; x > 0; x -= 1) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x]; tmp[x] = tmp[y]; tmp[y] = z;
    }

    res.json({ cards: tmp.slice(0, PACK_SIZE) });
  } catch (e) {
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

app.get('/api/spells', async (req, res) => {
  try {
    const d = await fetch(`https://api.potterdb.com/v1/spells?page[size]=${PAGE_SIZE}`);
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i += 1) {
      const s = r.data[i];
      const a = s.attributes;
      if (a.name && a.name !== '') {
        let dmg = DAMAGE_DEFAULT;
        if (a.category === 'Charm') dmg = DAMAGE_CHARM;
        if (a.category === 'Curse') dmg = DAMAGE_CURSE;
        if (a.category === 'Hex') dmg = DAMAGE_HEX;
        if (a.category === 'Jinx') dmg = DAMAGE_JINX;
        if (a.category === 'Spell') dmg = DAMAGE_SPELL;
        if (a.category === 'Transfiguration') dmg = DAMAGE_TRANSFIGURATION;
        if (a.category === 'Counter-spell') dmg = DAMAGE_COUNTER_SPELL;
        if (a.category === 'Healing spell') dmg = DAMAGE_HEALING;

        const obj = {};
        obj.id = s.id;
        obj.name = a.name;
        obj.effect = a.effect || 'Efeito desconhecido';
        obj.category = a.category || 'Spell';
        obj.light = a.light || 'Unknown';
        obj.damage = dmg;

        tmp.push(obj);
      }
    }

    for (let x = tmp.length - 1; x > 0; x -= 1) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x]; tmp[x] = tmp[y]; tmp[y] = z;
    }

    res.json({ spells: tmp.slice(0, SPELLS_SIZE) });
  } catch (e) {
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

app.post('/api/cpu-deck', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    const d = await fetch(`https://api.potterdb.com/v1/characters?page[size]=${PAGE_SIZE}&page[number]=${pg}`);
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i += 1) {
      const c = r.data[i];
      const a = c.attributes;
      if (a.name && a.name !== '' && a.image) {
        let pw = POWER_DEFAULT;
        if (a.house === 'Gryffindor') pw = POWER_GRYFFINDOR;
        if (a.house === 'Slytherin') pw = POWER_SLYTHERIN;
        if (a.house === 'Hufflepuff') pw = POWER_HUFFLEPUFF;
        if (a.house === 'Ravenclaw') pw = POWER_RAVENCLAW;

        let mg = MAGIC_DEFAULT;
        if (a.species === 'human') mg = MAGIC_HUMAN;
        if (a.species === 'half-giant') mg = MAGIC_HALF_GIANT;
        if (a.species === 'giant') mg = MAGIC_GIANT;
        if (a.species === 'house elf') mg = MAGIC_HOUSE_ELF;
        if (a.species === 'ghost') mg = MAGIC_GHOST;
        if (a.species === 'werewolf') mg = MAGIC_WEREWOLF;
        if (a.species === 'vampire') mg = MAGIC_VAMPIRE;
        if (a.species === 'centaur') mg = MAGIC_CENTAUR;

        let df = DEFENSE_DEFAULT;
        if (a.ancestry === 'pure-blood') df = DEFENSE_PURE_BLOOD;
        if (a.ancestry === 'half-blood') df = DEFENSE_HALF_BLOOD;
        if (a.ancestry === 'muggle-born') df = DEFENSE_MUGGLE_BORN;
        if (a.ancestry === 'muggle') df = DEFENSE_MUGGLE;
        if (a.ancestry === 'squib') df = DEFENSE_SQUIB;

        const hp = df + Math.floor(Math.random() * HP_RANDOM_RANGE) + HP_BASE_BONUS;

        const obj = {};
        obj.id = c.id;
        obj.name = a.name;
        obj.house = a.house || 'Unknown';
        obj.species = a.species || 'Unknown';
        obj.ancestry = a.ancestry || 'Unknown';
        obj.image = a.image;
        obj.power = pw;
        obj.magic = mg;
        obj.defense = df;
        obj.hp = hp;
        obj.maxHp = hp;

        tmp.push(obj);
      }
    }

    for (let x = tmp.length - 1; x > 0; x -= 1) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x]; tmp[x] = tmp[y]; tmp[y] = z;
    }

    res.json({ deck: tmp.slice(0, CPU_DECK_SIZE) });
  } catch (e) {
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

app.listen(PORT, () => {
  process.stdout.write(`rodando na porta ${PORT}\n`);
});
