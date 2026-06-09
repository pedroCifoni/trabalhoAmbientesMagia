# Documentação da Refatoração: Wizard Duel

## Problemas Encontrados

Durante a análise inicial do projeto, foram identificados os seguintes problemas de qualidade e débitos técnicos que precisavam ser corrigidos:

1. **Números Mágicos**: Havia vários valores literais sem contexto espalhados pelo código (como atributos de 50, 90, tamanho de páginas e limites de cura/dano).
2. **Nomes Sem Significado**: Variáveis abreviadas de maneira não intuitiva dificultavam muito a leitura. Variáveis como `d`, `r`, `tmp`, `c`, `a`, `obj`, `x`, `y`, `z`, `pw`, `mg`, `df` e `pg` estavam presentes nas lógicas de sorteio e atributos.
3. **Múltiplas Responsabilidades**: As rotas no back-end (em `index.js`) e as funções no front-end assumiam responsabilidades excessivas (ex: uma única rota realizava a busca de dados na API, filtrava, calculava os atributos baseados em regras de negócio complexas, embaralhava os itens e enviava a resposta).
4. **Código Duplicado (DRY)**: Tanto a rota `/api/pack` quanto `/api/cpu-deck` no back-end possuíam os exatos mesmos laços para filtrar, calcular atributos e embaralhar o deck, repetindo quase 50 linhas de código idêntico.
5. **Code Smells Gerais**:
   - Uso de `var` ao invés de `let` e `const`.
   - Concatenação de strings desajeitada ao invés do uso de template literals (crases).
   - Montagem de elementos HTML de forma manual (misturando lógica e renderização na mesma string) via concatenação.
   - Uso de `==` em vez de igualdade estrita (`===`).
   - Uso excessivo de variáveis globais expostas desnecessariamente e formatação de código inconsistente.

## Decisões Tomadas Durante a Refatoração

Para sanar os problemas e preparar o código para futuras atualizações de forma sustentável, as seguintes ações e decisões arquiteturais foram aplicadas:

1. **Extração de Constantes (`constants.js`)**:
   - Todos os números mágicos do back-end foram isolados no arquivo `constants.js`, e os números do front-end foram definidos como constantes em caixa alta (`const PLAYER_SPELLS_COUNT = 5`, etc). Isso torna o balanceamento do jogo muito mais simples no futuro.

2. **Renomeação de Variáveis e Funções**:
   - Variáveis curtas foram convertidas para seus respectivos nomes semânticos. Por exemplo, `pw`, `mg` e `df` tornaram-se `power`, `magic` e `defense`. Variáveis como `c` se tornaram `character` e `tmp` se tornou `validCharacters` ou `validSpells`.

3. **Separação de Responsabilidades no Back-end**:
   - **`index.js`**: Reduzido para conter apenas a configuração inicial do Express, middlewares e o direcionamento das rotas.
   - **`routes/`**: Criadas as rotas especializadas `characters.js`, `spells.js` e `game.js`, orquestrando apenas o fluxo da informação.
   - **`services/potterApi.js`**: Isolada a lógica de comunicação direta com a PotterDB API.
   - **`services/statsCalculator.js`**: Toda a lógica de negócio pesada, envolvendo o cálculo de atributos dos personagens baseado em espécie, casa e ancestralidade, e o cálculo de dano/cura dos feitiços, foi isolada em suas próprias funções.
   - **`utils/shuffle.js`**: O algoritmo de embaralhamento foi componentizado numa função reutilizável, eliminando de vez o código duplicado de embaralhamento de arrays.

4. **Separação de Responsabilidades no Front-end**:
   - **CSS**: Todo o bloco de `<style>` foi abstraído para `public/css/style.css`, limpando o arquivo HTML.
   - **JS (`public/js/`)**: O monólito que residia no `index.html` foi totalmente desacoplado.
     - `api.js`: Concentrou os métodos de requisição HTTP assíncronos (`fetchPack`, `fetchSpells`, `fetchCpuDeck`).
     - `render.js`: Ficou estritamente responsável pelas atualizações de estado visual do DOM, implementando o padrão de Template Literals com as funções `renderCardHtml`, `renderDeckBadges` e `renderSpells`.
     - `game.js`: Atua como o "Controller" do front-end, retendo e alterando o estado global (`state`), e operando as regras de turno, morte e cálculos randômicos de variância para o dano dos feitiços.

5. **Correção de "Code Smells" e Adesão ao Padrão Airbnb**:
   - Atualizados todos os operadores de igualdade genérica `==` para `===`.
   - Remoção completa da sintaxe `var`, com forte adoção de `const` por padrão e `let` quando uma mutação é imprescindível.
   - Uso de interpolação de strings limpa utilizando crases (template literals) em todo o front-end, facilitando a montagem de fragmentos HTML complexos em `render.js`.
   - Remoção de comentários não fundamentais do código, visto que o mesmo agora é bastante autoexplicativo (self-documenting).
   - O projeto foi rigorosamente avaliado pelo ESLint com o *preset* `airbnb-base`, corrigindo as quebras de linha (`CRLF`), exigência de aspas simples, ponto-e-vírgula obrigatório e declarações de variáveis corretas para atingir a marca de **0 erros de linting**.
