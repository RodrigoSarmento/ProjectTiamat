# Combate por deck de dados

Nota da conversa sobre o primeiro desenho de combate do ProjectTiamat.

## Ideia

O personagem começa com um deck de cartas no inventário (`saves.dices`). Hoje toda carta é um dado. No futuro, itens e outras cartas entram no mesmo deck. O combate funciona como um deckbuilder.

Os tamanhos ficam em `src/data/combat/deck.ts`: a mão tem 8 cartas (`HAND_SIZE`), um deck montado tem de 12 a 16 (`DECK_MIN_SIZE`, `DECK_MAX_SIZE`) e o jogador leva no máximo 5 dados por rodada (`PLAYER_MAX_SLOTS`). Cada dado entra uma vez só.

O deck inicial (`STARTER_DICES`) tem 6 dados diferentes de nível 1, uma cópia de cada: os três ataques d4 (`a`, `b`, `c`), duas defesas e um contra-ataque.

No começo da luta, o deck é embaralhado e 8 cartas vão para a mão. O resto fica no deck, virado para baixo.

Cada dado já nasce de ataque, de defesa ou de contra-ataque. Na preparação, a bandeja mostra a mão inteira, na ordem ataque, defesa e contra-ataque. Os dados quebram de linha só quando não cabem na largura, e a bandeja rola se a altura passar da tela. O jogador arrasta exatamente `saves.numOfDices` dados para o centro. Começa com 3 (`STARTER_NUM_OF_DICES`) e pode chegar a 5 quando sobe de nível, nunca mais do que a mão tem. Com 3 espaços, uma escolha comum é 2 de ataque e 1 de defesa.

No ataque, o jogador rola os dados de ataque escolhidos e o inimigo rola os de defesa e de contra-ataque. Na defesa, o jogador rola os de defesa e de contra-ataque escolhidos e o inimigo rola os de ataque.

### Contra-ataque

O dado de contra-ataque bloqueia como um dado de defesa. Quando a defesa total passa do ataque, ele devolve ao atacante a sobra do bloqueio, limitada ao que os dados de contra-ataque tiraram. Exemplo: ataque 2, defesa 1 + contra-ataque 3 = 4. O defensor não toma dano e o atacante toma `min(4 − 2, 3)` = 2.

As faces trazem um número, que é o valor da rolagem, ou nada (`0`), que é um erro.

Os dados escolhidos saem da mão e vão para o morto. A mão compra do deck o mesmo número de cartas até voltar a ter 8. Quando o deck acaba, o morto inteiro é embaralhado e vira o novo deck. A preparação mostra quantas cartas ainda estão no deck.

### Níveis

O id de cada dado segue `<tipo>-d<lados>-level<1|2|3>-<papel>`, por exemplo `attack-d4-level1-a`. O tipo é `attack`, `defense` ou `counter`. A letra é o papel do dado:

- `a`, constante: nunca tira 0 (`attack-d4-level1-a` = `1 1 1 1`).
- `b`, oscilante: às vezes tira 0, mas tem uma face alta (`attack-d4-level1-b` = `0 1 1 2`).
- `c`, tudo ou nada: tira 0 em 3 de cada 4 rolagens ou mais, e o resto é uma face muito alta (`attack-d4-level1-c` = `0 0 0 4`).

Como o dano nunca fica abaixo de 0, um ataque arriscado rende mais dano do que um constante com a mesma média, e uma defesa arriscada deixa passar mais. Por isso o balanceamento não compara só médias. Cada dado tem um **Valor**, calculado por `diceValue` em `src/helper/diceOdds.ts`:

- Ataque: dano médio contra o defensor sem defesa ou com um dado de defesa de referência (`0 1 1 1`), metade das vezes cada. Com poucos dados de defesa, o outro lado muitas vezes não tem nenhum.
- Defesa: dano médio bloqueado de um ataque de referência (`0 1 2 3`).
- Contra-ataque: bloqueio mais dano devolvido contra o mesmo ataque de referência, que dá a média das faces.

**Ataque: risco alto, recompensa alta.** Todo ataque do mesmo nível tem a mesma Média (1, 1,5 e 2). O Valor fica em Média − 0,375 × Acerto, então quanto mais o dado erra, mais dano rende quando acerta e mais atravessa defesa. Assim `a` < `b` < `c` em Valor, com o `c` no máximo 50% acima do `a`:

| Papel | Nível 1   | Nível 2   | Nível 3   |
| ----- | --------- | --------- | --------- |
| `a`   | 0,63      | 1,13      | 1,63      |
| `b`   | 0,72–0,77 | 1,22–1,25 | 1,69–1,72 |
| `c`   | 0,91      | 1,41      | 1,91      |

**Defesa** vale 0,75, 1 e 1,25. **Contra-ataque** empata com a defesa no nível 1 e passa à frente nos níveis seguintes:

| Tipo          | Nível 1 | Nível 2 | Nível 3 |
| ------------- | ------- | ------- | ------- |
| Defesa        | 0,75    | 1       | 1,25    |
| Contra-ataque | 0,75    | 1,25    | 1,75    |

Ficar sem defesa pesa mais do que ficar sem ataque. Então há poucos dados de defesa, e todos são estáveis (`a` ou `b` com no máximo uma face 0). A escolha é quando levar defesa, e não se haverá defesa. O contra-ataque é sempre `c`: arrisca bloquear pouco para devolver muito.

Há menos ataques nos níveis altos (6, 5 e 4), e defesa e contra-ataque têm 2 dados por nível.

As chances e o Valor de cada dado ficam em [`dados.md`](dados.md), gerado por `npm run dice:report`.

`src/data/combat/dices.spec.ts` confere essas regras.

### Inimigo

O inimigo tem o próprio deck (`diceDeck`) e sorteia `numOfDices` dados dele a cada rodada, sem morto. Esse número é de cada inimigo, separado do jogador. O primeiro inimigo rola 2, e outro inimigo pode rolar mais. Cada dado `enemy-*` é a cópia de um dado do jogador com a face mais alta reduzida em 1 (quando isso repetiria outro dado, a cópia perde 1 em outra face). Assim, a Média e o Valor de um dado do inimigo ficam sempre abaixo dos dados do jogador do mesmo tipo, nível e papel, mas um dado do inimigo de nível 2 ainda supera um dado do jogador de nível 1.

### Ordem da rodada

Cada lado rola um d20 de iniciativa (empate rola de novo). Quem tirar mais ataca primeiro. Um lado sem dados de ataque pula a própria troca, e a tela avisa isso no lugar da iniciativa. Se nenhum lado tem dados de ataque, a rodada acaba e volta para a preparação. A luta termina quando um lado chega a 0 PV.

### Exemplo de turno

Quatro dados escolhidos:

| Dado | Tipo   | Faces                 |
| ---- | ------ | --------------------- |
| 1d6  | ataque | +1 +1 +2 +2 0 0       |
| 1d4  | ataque | +1 +1 +1 +2           |
| 1d4  | defesa | 0 +1 +1 +1            |
| 1d8  | ataque | 0 0 +1 +1 +2 +2 +3 +4 |

Ataque do jogador: +2, +1 e +3, total 6. Defesa do inimigo: +3. Saldo: 3 de dano no inimigo.

Defesa do jogador: +1. Ataque do inimigo: +3. Saldo: 2 de dano no jogador.

Esses 4 dados vão para o morto e a mão compra 4 cartas do deck.

## Dá para fazer em React Native

O combate é um jogo de turno com estado. O app já é isso: telas, Redux e regras em TypeScript. Uma game engine entra quando o jogo precisa de simulação contínua (física, câmera, mundo 3D). Aqui o motor é uma máquina de estados pequena.

O d20 que já existe em `src/components/dice-roll-d20` mostra um caminho possível para 3D: Three.js dentro de uma WebView, e o React Native só pede o resultado. Quatro dados na mesma cena seriam uma extensão disso. Não é o caminho recomendado para o combate. Ver a seção seguinte.

## A WebView é a parte difícil

O d20 atual vive numa string HTML com Three.js (`diceSceneHtml.ts`): geometria, textura, spin e mensagem de volta para o React Native. Por isso mudar cor, tamanho ou número já é trabalhoso. Colocar vários dados 3D girando juntos nessa mesma string multiplica essa dificuldade.

O deck em si é pequeno. São três pilhas de cartas, montadas a partir do catálogo de dados (`src/data/combat/dices.ts`):

```ts
type ICombatDie = {
  id: string; // 'attack-d4-level1-a#0' — uma carta por entrada do deck
  sides: 4 | 6 | 8;
  kind: 'attack' | 'defense' | 'counter';
  faces: number[]; // [0, 0, 1, 1, 2, 2]
};

type ICombatPiles = {
  hand: ICombatDie[]; // a mão
  drawPile: ICombatDie[]; // o deck
  discard: ICombatDie[]; // o morto
};
```

As regras são funções puras em `src/helper/combatDice.ts` (`dealHand`, `playCards`, `drawCards`, `shuffle`), no mesmo estilo de `storyPlayback`. Uma rodada:

1. No começo da luta (e ao tentar de novo), o deck é embaralhado e a mão recebe 8 cartas.
2. A bandeja mostra a mão.
3. O jogador arrasta `saves.numOfDices` dados para o centro (de 3 a 5). O tipo vem do próprio dado.
4. O inimigo sorteia o próprio `numOfDices` dados do próprio deck.
5. O d20 de iniciativa decide quem ataca primeiro. Um lado sem dados de ataque pula a própria troca.
6. Em cada troca, soma uma face aleatória de cada dado. Dano = ataque − defesa, nunca abaixo de 0. Se a defesa passar do ataque, o contra-ataque devolve a sobra ao atacante, até o que os dados de contra-ataque tiraram.
7. Os escolhidos saem da mão e vão para o morto. A mão compra do deck até voltar a 8.
8. Se o deck acabar durante a compra, o morto é embaralhado, vira o novo deck e a compra continua.
9. Se alguém chegou a 0 PV, vai para o resultado final. Se não, volta para a preparação.

Isso não precisa de engine, física nem canvas. Dá para testar no Jest com um turno inteiro e um resultado fixo, sem abrir o app.

## Como apresentar

Cada dado é um componente React Native: um retângulo com as faces escritas (`+1 +1 +2 0`). O jogador segura e arrasta o dado da bandeja para um espaço no centro. Segurar de novo devolve para a bandeja. Na rolagem, o Reanimated gira o número e para na face que a regra já sorteou. O valor nasce no TypeScript. A animação só mostra esse valor.

O d20 3D continua para o teste da história, onde existe um dado só. O combate usa dados 2D nativos, estilizados com `StyleSheet` como o resto do livro. Um dado 3D de combate só vale a pena depois que esse loop estiver divertido de jogar.

## Godot

Godot serve bem para ação, física e cenário. Para este combate, a troca seria reescrever diálogo, escolhas, saves, tradução e criação de personagem, ou embutir uma cena Godot dentro do app. Isso significa dois toolchains e uma ponte nativa por plataforma.

Godot passa a fazer sentido se o jogo ganhar exploração em tempo real, câmera e mapa. Para encontros de dados no meio do livro, o React Native basta.
