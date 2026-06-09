# Wizard Duel

Bem-vindo ao **Wizard Duel**, um jogo de cartas temático ambientado no universo de Harry Potter!

Este projeto é uma aplicação web completa desenvolvida com Node.js + Express no back-end e HTML/CSS/JS puro no front-end, e consome a [PotterDB API](https://potterdb.com/) para obter os personagens e feitiços.

---

## Como executar o jogo localmente

Para rodar a aplicação em seu próprio computador, siga os passos abaixo no terminal:

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Inicie o servidor local**
   ```bash
   npm start
   ```

3. **Acesse o jogo**
   Abra o seu navegador e acesse a URL: [http://localhost:3000](http://localhost:3000)

---

## Como funciona o jogo

A mecânica do Wizard Duel é muito simples e imersiva. 

Cada carta do jogo representa um personagem do universo mágico de Harry Potter. Todos eles possuem 4 atributos fundamentais que determinam sua força: **Poder**, **Magia**, **Defesa** e uma certa dose de **Sorte** (representada pelo HP base do personagem).

1. **Fase de Draft:** Ao iniciar o jogo, você recebe algumas cartas de bruxos aleatórios. Escolha cuidadosamente **2 personagens** para formar o seu baralho (deck).
2. **A Batalha:** Durante os confrontos, a cada rodada você terá à disposição uma lista de feitiços (que variam de fortes Maldições até úteis Feitiços de Cura). Escolha um feitiço para lançar contra o personagem do computador (CPU).
3. **Condição de Eliminação:** O personagem cujo Pontos de Vida (HP) chegarem a zero estará eliminado da partida.
4. **Condição de Vitória:** O duelista que conseguir derrotar e eliminar todos os personagens adversários primeiro será o grande campeão.

---

## Qualidade do Código e Refatoração

Este repositório foi amplamente reestruturado e refatorado em busca de maior qualidade de código de acordo com o guia de estilo padrão de mercado da **Airbnb** validado via **ESLint**. Você pode ler mais a fundo sobre as melhorias arquiteturais e correções no arquivo [REFATORACAO.md](REFATORACAO.md) disponibilizado na raiz deste projeto.
