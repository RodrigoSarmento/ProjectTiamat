# Combate por deck de dados

Nota da conversa sobre o primeiro desenho de combate do ProjectTiamat.

## Ideia

O personagem começa com dados no inventário (`saves.dices`). O combate funciona como um deckbuilder de dados.

Cada dado já nasce de ataque ou de defesa. Na preparação, a bandeja mostra todos os dados do deck que não estão no morto. O jogador arrasta exatamente `numOfDices` dados para o centro (hoje 2, nunca mais do que o tamanho do deck). Exemplo: 15 no deck e 4 espaços. Ele pode levar 3 de ataque e 1 de defesa.

No ataque, o jogador rola os dados de ataque escolhidos e o inimigo rola os de defesa. Na defesa, o jogador rola os de defesa escolhidos e o inimigo rola os de ataque.

As faces trazem um número, que é o valor da rolagem, ou nada (`0`), que é um erro.

Os dados escolhidos vão para o morto. Os que não foram escolhidos continuam na bandeja. Quando sobram menos dados fora do morto do que espaços, o morto inteiro volta para o deck.

### Inimigo

O inimigo tem o próprio deck (`diceDeck`) e sorteia `numOfDices` dados dele a cada rodada, sem morto. Os dados `enemy-*` do catálogo são, em geral, versões mais fracas dos dados do jogador, com mais faces `0`.

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

Esses 4 dados vão para o morto. Na próxima preparação, a bandeja mostra o resto do deck.

## Dá para fazer em React Native

O combate é um jogo de turno com estado. O app já é isso: telas, Redux e regras em TypeScript. Uma game engine entra quando o jogo precisa de simulação contínua (física, câmera, mundo 3D). Aqui o motor é uma máquina de estados pequena.

O d20 que já existe em `src/components/dice-roll-d20` mostra um caminho possível para 3D: Three.js dentro de uma WebView, e o React Native só pede o resultado. Quatro dados na mesma cena seriam uma extensão disso. Não é o caminho recomendado para o combate. Ver a seção seguinte.

## A WebView é a parte difícil

O d20 atual vive numa string HTML com Three.js (`diceSceneHtml.ts`): geometria, textura, spin e mensagem de volta para o React Native. Por isso mudar cor, tamanho ou número já é trabalhoso. Colocar vários dados 3D girando juntos nessa mesma string multiplica essa dificuldade.

O deck em si é pequeno. São duas listas de ids e o catálogo de dados (`src/data/combat/dice.ts`):

```ts
type ICombatDie = {
  id: string;
  sides: 4 | 6 | 8;
  kind: 'attack' | 'defense';
  faces: number[]; // [0, 0, 1, 1, 2, 2]
};

type CombatState = {
  deck: string[]; // saves.dices
  deadIds: string[]; // o morto
};
```

As regras são funções puras em `src/helper/combatDice.ts`, no mesmo estilo de `storyPlayback`. Uma rodada:

1. A bandeja mostra o deck sem o morto.
2. O jogador arrasta `numOfDices` dados para o centro. O tipo vem do próprio dado.
3. O inimigo sorteia `numOfDices` dados do próprio deck.
4. O d20 de iniciativa decide quem ataca primeiro. Um lado sem dados de ataque pula a própria troca.
5. Em cada troca, soma uma face aleatória de cada dado. Dano = ataque − defesa, nunca abaixo de 0.
6. Os escolhidos vão para o morto.
7. Se sobrarem menos dados fora do morto do que `numOfDices`, o morto inteiro volta para o deck.
8. Se alguém chegou a 0 PV, vai para o resultado final. Se não, volta para a preparação.

Isso não precisa de engine, física nem canvas. Dá para testar no Jest com um turno inteiro e um resultado fixo, sem abrir o app.

## Como apresentar

Cada dado é um componente React Native: um retângulo com as faces escritas (`+1 +1 +2 0`). O jogador segura e arrasta o dado da bandeja para um espaço no centro. Segurar de novo devolve para a bandeja. Na rolagem, o Reanimated gira o número e para na face que a regra já sorteou. O valor nasce no TypeScript. A animação só mostra esse valor.

O d20 3D continua para o teste da história, onde existe um dado só. O combate usa dados 2D nativos, estilizados com `StyleSheet` como o resto do livro. Um dado 3D de combate só vale a pena depois que esse loop estiver divertido de jogar.

## Godot

Godot serve bem para ação, física e cenário. Para este combate, a troca seria reescrever diálogo, escolhas, saves, tradução e criação de personagem, ou embutir uma cena Godot dentro do app. Isso significa dois toolchains e uma ponte nativa por plataforma.

Godot passa a fazer sentido se o jogo ganhar exploração em tempo real, câmera e mapa. Para encontros de dados no meio do livro, o React Native basta.
