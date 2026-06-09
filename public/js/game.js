const state = {
  phase: 'loading',
  pack: [],
  selectedCards: [],
  playerDeck: [],
  cpuDeck: [],
  spells: [],
  playerSpells: [],
  round: 1,
  scoreP: 0,
  scoreC: 0,
  waiting: false,
};

const RANDOM_VARIANCE_MIN = 0.8;
const RANDOM_VARIANCE_MAX = 0.4;
const PLAYER_SPELLS_COUNT = 5;

function endGame() {
  const over = document.getElementById('screen-over');
  const glyph = document.getElementById('overGlyph');
  const title = document.getElementById('overTitle');
  const sub = document.getElementById('overSub');
  const score = document.getElementById('overScore');

  if (state.scoreP > state.scoreC) {
    glyph.textContent = '🏆';
    title.textContent = 'Vitória!';
    sub.textContent = 'Você dominou o duelo!';
  } else if (state.scoreC > state.scoreP) {
    glyph.textContent = '💀';
    title.textContent = 'Derrota';
    sub.textContent = 'O CPU foi mais poderoso desta vez.';
  } else {
    glyph.textContent = '✦';
    title.textContent = 'Empate';
    sub.textContent = 'Bruxos igualmente poderosos.';
  }
  score.textContent = `Você ${state.scoreP}  ×  ${state.scoreC} CPU`;
  over.classList.add('active');
}

function getActiveIdx(deck) {
  for (let index = 0; index < deck.length; index += 1) {
    if (deck[index].hp > 0) return index;
  }
  return -1;
}

function renderBattleState() {
  const playerIndex = getActiveIdx(state.playerDeck);
  const cpuIndex = getActiveIdx(state.cpuDeck);

  if (playerIndex < 0 || cpuIndex < 0) {
    endGame();
    return;
  }

  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  document.getElementById('playerActiveName').textContent = playerCharacter.name;
  document.getElementById('cpuActiveName').textContent = cpuCharacter.name;

  const playerSlot = document.getElementById('playerCardSlot');
  const cpuSlot = document.getElementById('cpuCardSlot');

  const playerDiv = document.createElement('div');
  playerDiv.className = 'card battle-card';
  playerDiv.id = 'battleCardP';
  playerDiv.innerHTML = window.render.renderCardHtml(playerCharacter);
  playerSlot.innerHTML = '';
  playerSlot.appendChild(playerDiv);

  const cpuDiv = document.createElement('div');
  cpuDiv.className = 'card battle-card';
  cpuDiv.id = 'battleCardC';
  cpuDiv.innerHTML = window.render.renderCardHtml(cpuCharacter);
  cpuSlot.innerHTML = '';
  cpuSlot.appendChild(cpuDiv);

  window.render.renderDeckBadges(state.playerDeck, playerIndex, 'playerDeckBadges');
  window.render.renderDeckBadges(state.cpuDeck, cpuIndex, 'cpuDeckBadges');
  window.render.renderSpells(!state.waiting, state.playerSpells);
}

function startBattle() {
  state.round = 1;
  state.scoreP = 0;
  state.scoreC = 0;
  state.waiting = false;

  document.getElementById('scoreP').textContent = '0';
  document.getElementById('scoreC').textContent = '0';
  document.getElementById('roundNum').textContent = '1';
  document.getElementById('battleLog').innerHTML = '';
  document.getElementById('btnNext').style.display = 'none';

  window.render.showScreen('screen-battle');
  renderBattleState();
  window.render.logBattle('⚔ O duelo começou! Escolha um feitiço para atacar.', 'info');
  window.render.updateStatus('Escolha um feitiço para atacar!');
}

function confirmDraft() {
  if (state.selectedCards.length < 2) return;
  state.playerDeck = [
    state.pack[state.selectedCards[0]],
    state.pack[state.selectedCards[1]],
  ];
  startBattle();
}

async function rerollPack() {
  state.selectedCards = [];
  document.getElementById('packGrid').innerHTML = '<div style="text-align:center;padding:40px;font-family:Cinzel,serif;font-size:0.7rem;letter-spacing:2px;color:var(--parchment-dark);grid-column:1/-1">Invocando novos bruxos...</div>';
  const newPack = await window.api.fetchPack();
  state.pack = newPack;
  window.render.renderPack(state.pack, state.selectedCards);
}

function toggleDraftCard(index) {
  const position = state.selectedCards.indexOf(index);
  if (position >= 0) {
    state.selectedCards.splice(position, 1);
  } else {
    if (state.selectedCards.length >= 2) return;
    state.selectedCards.push(index);
  }
  window.render.renderPack(state.pack, state.selectedCards);
}

function castSpell(spellIndex) {
  if (state.waiting) return;
  state.waiting = true;
  window.render.renderSpells(false, state.playerSpells);

  const spell = state.playerSpells[spellIndex];
  const playerIndex = getActiveIdx(state.playerDeck);
  const cpuIndex = getActiveIdx(state.cpuDeck);
  const playerCharacter = state.playerDeck[playerIndex];
  const cpuCharacter = state.cpuDeck[cpuIndex];

  const playerVariance = Math.random() * RANDOM_VARIANCE_MAX + RANDOM_VARIANCE_MIN;
  const playerDamage = Math.floor(spell.damage * (playerCharacter.magic / 100) * playerVariance);

  if (spell.damage < 0) {
    const healAmount = Math.abs(playerDamage);
    playerCharacter.hp = Math.min(playerCharacter.maxHp, playerCharacter.hp + healAmount);
    window.render.logBattle(`✨ ${spell.name} — você curou ${healAmount} HP! (${playerCharacter.name}: ${playerCharacter.hp} HP)`, 'heal');
    const cardElement = document.getElementById('battleCardP');
    if (cardElement) cardElement.classList.add('battling');
    setTimeout(() => {
      const card = document.getElementById('battleCardP');
      if (card) card.classList.remove('battling');
    }, 500);
  } else {
    cpuCharacter.hp -= playerDamage;
    const remainingHp = Math.max(0, cpuCharacter.hp);
    window.render.logBattle(`⚡ ${spell.name} → ${cpuCharacter.name} perdeu ${playerDamage} HP! (${cpuCharacter.name}: ${remainingHp} HP)`, 'win');
    const cardElement = document.getElementById('battleCardC');
    if (cardElement) cardElement.classList.add('hit');
    setTimeout(() => {
      const card = document.getElementById('battleCardC');
      if (card) card.classList.remove('hit');
    }, 600);
  }

  setTimeout(() => {
    const cpuSpellIndex = Math.floor(Math.random() * state.spells.length);
    const cpuSpell = state.spells[cpuSpellIndex];
    const cpuVariance = Math.random() * RANDOM_VARIANCE_MAX + RANDOM_VARIANCE_MIN;
    const cpuDamage = Math.floor(cpuSpell.damage * (cpuCharacter.magic / 100) * cpuVariance);

    if (cpuSpell.damage < 0) {
      const cpuHeal = Math.abs(cpuDamage);
      cpuCharacter.hp = Math.min(cpuCharacter.maxHp, cpuCharacter.hp + cpuHeal);
      window.render.logBattle(`🧙 CPU: ${cpuSpell.name} — CPU curou ${cpuHeal} HP! (${cpuCharacter.name}: ${cpuCharacter.hp} HP)`, 'heal');
      const cardElement = document.getElementById('battleCardC');
      if (cardElement) cardElement.classList.add('battling');
      setTimeout(() => {
        const card = document.getElementById('battleCardC');
        if (card) card.classList.remove('battling');
      }, 500);
    } else {
      playerCharacter.hp -= cpuDamage;
      const remainingHp = Math.max(0, playerCharacter.hp);
      window.render.logBattle(`💀 CPU: ${cpuSpell.name} → ${playerCharacter.name} perdeu ${cpuDamage} HP! (${playerCharacter.name}: ${remainingHp} HP)`, 'lose');
      const cardElement = document.getElementById('battleCardP');
      if (cardElement) cardElement.classList.add('hit');
      setTimeout(() => {
        const card = document.getElementById('battleCardP');
        if (card) card.classList.remove('hit');
      }, 600);
    }

    setTimeout(() => {
      let roundOver = false;

      if (playerIndex >= 0 && state.playerDeck[playerIndex].hp <= 0) {
        window.render.logBattle(`💀 ${state.playerDeck[playerIndex].name} foi derrotado!`, 'lose');
        state.scoreC += 1;
        document.getElementById('scoreC').textContent = state.scoreC;
        roundOver = true;
      }
      if (cpuIndex >= 0 && state.cpuDeck[cpuIndex].hp <= 0) {
        window.render.logBattle(`🏆 ${state.cpuDeck[cpuIndex].name} foi derrotado!`, 'win');
        state.scoreP += 1;
        document.getElementById('scoreP').textContent = state.scoreP;
        roundOver = true;
      }

      renderBattleState();

      const playerAliveIndex = getActiveIdx(state.playerDeck);
      const cpuAliveIndex = getActiveIdx(state.cpuDeck);

      if (playerAliveIndex < 0 || cpuAliveIndex < 0) {
        setTimeout(endGame, 800);
        return;
      }

      state.waiting = false;

      if (roundOver) {
        state.round += 1;
        document.getElementById('roundNum').textContent = state.round;
        window.render.logBattle(`— Rodada ${state.round} —`, 'info');
      }

      window.render.updateStatus('Escolha um feitiço para atacar!');
      window.render.renderSpells(true, state.playerSpells);
    }, 700);
  }, 800);
}

function nextRound() {
  document.getElementById('btnNext').style.display = 'none';
  state.round += 1;
  document.getElementById('roundNum').textContent = state.round;
  window.render.logBattle(`— Rodada ${state.round} —`, 'info');
  state.waiting = false;
  renderBattleState();
  window.render.updateStatus('Escolha um feitiço para atacar!');
}

async function loadGame() {
  const loadingBar = document.getElementById('loadBar');
  const loadingMessage = document.getElementById('loadMsg');

  loadingMessage.textContent = 'Invocando personagens...';
  loadingBar.style.width = '20%';

  state.pack = await window.api.fetchPack();

  loadingBar.style.width = '55%';
  loadingMessage.textContent = 'Consultando o livro de feitiços...';

  state.spells = await window.api.fetchSpells();

  loadingBar.style.width = '85%';
  loadingMessage.textContent = 'Preparando o adversário...';

  state.cpuDeck = await window.api.fetchCpuDeck();

  const shuffledSpells = [...state.spells];
  for (let currentIndex = shuffledSpells.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temporaryValue = shuffledSpells[currentIndex];
    shuffledSpells[currentIndex] = shuffledSpells[randomIndex];
    shuffledSpells[randomIndex] = temporaryValue;
  }
  state.playerSpells = shuffledSpells.slice(0, PLAYER_SPELLS_COUNT);

  loadingBar.style.width = '100%';
  loadingMessage.textContent = 'Pronto!';

  setTimeout(() => {
    document.getElementById('screen-loading').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('screen-loading').style.display = 'none';
      window.render.showScreen('screen-draft');
      window.render.renderPack(state.pack, state.selectedCards);
    }, 600);
  }, 400);
}

function restartGame() {
  document.getElementById('screen-over').classList.remove('active');
  state.selectedCards = [];
  state.pack = [];
  state.playerDeck = [];

  const loadingElement = document.getElementById('screen-loading');
  loadingElement.style.display = 'flex';
  loadingElement.classList.remove('fade-out');
  document.getElementById('loadBar').style.width = '0%';
  window.render.showScreen('');
  loadGame();
}

window.game = {
  confirmDraft,
  rerollPack,
  toggleDraftCard,
  castSpell,
  nextRound,
  restartGame,
};

window.confirmDraft = confirmDraft;
window.rerollPack = rerollPack;
window.castSpell = castSpell;
window.nextRound = nextRound;
window.restartGame = restartGame;

window.onload = () => {
  loadGame();
};
