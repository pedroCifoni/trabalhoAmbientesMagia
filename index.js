const express = require('express');
const charactersRoute = require('./routes/characters');
const spellsRoute = require('./routes/spells');
const gameRoute = require('./routes/game');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use('/api', charactersRoute);
app.use('/api', spellsRoute);
app.use('/api', gameRoute);

app.listen(PORT, () => {
  process.stdout.write(`rodando na porta ${PORT}\n`);
});
