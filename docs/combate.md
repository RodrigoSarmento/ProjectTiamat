# Combate por deck de dados

Nota da conversa sobre o primeiro desenho de combate do ProjectTiamat.

## Ideia

O personagem começa com dados no inventário. O combate funciona como um deckbuilder de dados.

Cada turno mostra alguns dados do inventário. Exemplo: 15 no deck e 6 disponíveis. Dentre esses 6, o jogador escolhe quais entram na rodada e separa ataque de defesa. Pode selecionar 3 de ataque e 1 de defesa.

No ataque, o jogador rola os dados de ataque e o inimigo rola os de defesa. Na defesa, o jogador rola o que sobrou e o inimigo rola os de ataque.

As faces trazem um número, que é o valor da rolagem, ou nada (`0`), que é um erro.

Os dados escolhidos vão para o morto. No turno seguinte, o mesmo número de dados é sorteado do deck para repor a mão. Os que não foram escolhidos continuam disponíveis.

### Exemplo de turno

Quatro dados escolhidos:

| Dado | Tipo | Faces |
| --- | --- | --- |
| 1d6 | ataque | +1 +1 +2 +2 0 0 |
| 1d4 | ataque | +1 +1 +1 +2 |
| 1d4 | defesa | 0 +1 +1 +1 |
| 1d8 | ataque | 0 0 +1 +1 +2 +2 +3 +4 |

Ataque do jogador: +2, +1 e +3, total 6. Defesa do inimigo: +3. Saldo: 3 de dano no inimigo.

Defesa do jogador: +1. Ataque do inimigo: +3. Saldo: 2 de dano no jogador.

Esses 4 dados vão para o morto e 4 novos saem do deck.

## Dá para fazer em React Native

O combate é um jogo de turno com estado. O app já é isso: telas, Redux e regras em TypeScript. Uma game engine entra quando o jogo precisa de simulação contínua (física, câmera, mundo 3D). Aqui o motor é uma máquina de estados pequena.

O d20 que já existe em `src/components/dice-roll-d20` mostra um caminho possível para 3D: Three.js dentro de uma WebView, e o React Native só pede o resultado. Quatro dados na mesma cena seriam uma extensão disso. Não é o caminho recomendado para o combate. Ver a seção seguinte.

## A WebView é a parte difícil

O d20 atual vive numa string HTML com Three.js (`diceSceneHtml.ts`): geometria, textura, spin e mensagem de volta para o React Native. Por isso mudar cor, tamanho ou número já é trabalhoso. Colocar vários dados 3D girando juntos nessa mesma string multiplica essa dificuldade.

O deck em si é pequeno. São três pilhas e uma lista de objetos:

```ts
type Die = {
  id: string;
  kind: 'attack' | 'defense';
  faces: number[]; // [1, 1, 2, 2, 0, 0]
};

type Combat = {
  deck: Die[];
  hand: Die[];
  discard: Die[];
};
```

Um turno é uma função pura, no mesmo estilo de `storyPlayback`:

1. Comprar até a mão ter 6.
2. O jogador marca quais dados vão para ataque e quais para defesa.
3. Somar uma face aleatória de cada dado escolhido.
4. Saldo do ataque = soma do jogador − defesa do inimigo.
5. Saldo da defesa = ataque do inimigo − soma do jogador.
6. Os escolhidos saem da mão e entram no `discard`.
7. Se o `deck` acabar, o `discard` embaralha e volta a ser o deck.

Isso não precisa de engine, física nem canvas. Dá para testar no Jest com um turno inteiro e um resultado fixo, sem abrir o app.

## Como apresentar

Cada dado é um componente React Native: um retângulo com as faces escritas (`+1 +1 +2 0`). Um toque marca ataque, outro marca defesa. Na rolagem, o Reanimated gira o número e para na face que a regra já sorteou. O valor nasce no TypeScript. A animação só mostra esse valor.

O d20 3D continua para o teste da história, onde existe um dado só. O combate usa dados 2D nativos, estilizados com `StyleSheet` como o resto do livro. Um dado 3D de combate só vale a pena depois que esse loop estiver divertido de jogar.

## Godot

Godot serve bem para ação, física e cenário. Para este combate, a troca seria reescrever diálogo, escolhas, saves, tradução e criação de personagem, ou embutir uma cena Godot dentro do app. Isso significa dois toolchains e uma ponte nativa por plataforma.

Godot passa a fazer sentido se o jogo ganhar exploração em tempo real, câmera e mapa. Para encontros de dados no meio do livro, o React Native basta.
