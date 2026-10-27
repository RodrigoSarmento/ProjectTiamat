# Dados do jogador

Gerado por `npm run dice:report` a partir de `src/data/combat/dices.ts`. Não edite à mão.

**Acerto** é a chance de tirar mais que 0. **Média** é o valor médio de uma rolagem. As colunas numeradas mostram a chance de tirar cada valor.

**Valor** é o que o balanceamento compara entre dados do mesmo tipo e nível. Ataque: dano médio contra o defensor sem defesa ou com um dado de defesa de referência (0 1 1 1), metade das vezes cada. Todo ataque do mesmo nível tem a mesma Média, e quanto menor o Acerto, maior o Valor. Defesa: dano médio bloqueado de um dado de ataque de referência (0 1 2 3). Contra-ataque: bloqueio mais o dano devolvido contra o mesmo ataque de referência.

## Ataque

| Dado               | Nível | Faces           | Acerto | Média | Valor | 0     | 1     | 2     | 3     | 4     | 5     | 6   | 7     | 8   |
| ------------------ | ----- | --------------- | ------ | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | --- | ----- | --- |
| attack-d4-level1-a | 1     | 1 1 1 1         | 100%   | 1     | 0,63  |       | 100%  |       |       |       |       |     |       |     |
| attack-d4-level1-b | 1     | 0 1 1 2         | 75%    | 1     | 0,72  | 25%   | 50%   | 25%   |       |       |       |     |       |     |
| attack-d4-level1-c | 1     | 0 0 0 4         | 25%    | 1     | 0,91  | 75%   |       |       |       | 25%   |       |     |       |     |
| attack-d6-level1-b | 1     | 0 0 1 1 1 3     | 66,7%  | 1     | 0,75  | 33,3% | 50%   |       | 16,7% |       |       |     |       |     |
| attack-d8-level1-b | 1     | 0 0 0 1 1 1 1 4 | 62,5%  | 1     | 0,77  | 37,5% | 50%   |       |       | 12,5% |       |     |       |     |
| attack-d8-level1-c | 1     | 0 0 0 0 0 0 3 5 | 25%    | 1     | 0,91  | 75%   |       |       | 12,5% |       | 12,5% |     |       |     |
| attack-d4-level2-a | 2     | 1 1 2 2         | 100%   | 1,5   | 1,13  |       | 50%   | 50%   |       |       |       |     |       |     |
| attack-d4-level2-b | 2     | 0 1 1 4         | 75%    | 1,5   | 1,22  | 25%   | 50%   |       |       | 25%   |       |     |       |     |
| attack-d4-level2-c | 2     | 0 0 0 6         | 25%    | 1,5   | 1,41  | 75%   |       |       |       |       |       | 25% |       |     |
| attack-d6-level2-b | 2     | 0 0 1 2 2 4     | 66,7%  | 1,5   | 1,25  | 33,3% | 16,7% | 33,3% |       | 16,7% |       |     |       |     |
| attack-d8-level2-c | 2     | 0 0 0 0 0 0 5 7 | 25%    | 1,5   | 1,41  | 75%   |       |       |       |       | 12,5% |     | 12,5% |     |
| attack-d4-level3-a | 3     | 2 2 2 2         | 100%   | 2     | 1,63  |       |       | 100%  |       |       |       |     |       |     |
| attack-d4-level3-c | 3     | 0 0 0 8         | 25%    | 2     | 1,91  | 75%   |       |       |       |       |       |     |       | 25% |
| attack-d6-level3-b | 3     | 0 1 2 3 3 3     | 83,3%  | 2     | 1,69  | 16,7% | 16,7% | 16,7% | 50%   |       |       |     |       |     |
| attack-d8-level3-b | 3     | 0 0 1 2 3 3 3 4 | 75%    | 2     | 1,72  | 25%   | 12,5% | 12,5% | 37,5% | 12,5% |       |     |       |     |

## Defesa

| Dado                | Nível | Faces       | Acerto | Média | Valor | 0     | 1     | 2    | 3     | 4   | 5   | 6   | 7   | 8   |
| ------------------- | ----- | ----------- | ------ | ----- | ----- | ----- | ----- | ---- | ----- | --- | --- | --- | --- | --- |
| defense-d4-level1-a | 1     | 1 1 1 1     | 100%   | 1     | 0,75  |       | 100%  |      |       |     |     |     |     |     |
| defense-d6-level1-b | 1     | 0 1 1 1 1 3 | 83,3%  | 1,17  | 0,75  | 16,7% | 66,7% |      | 16,7% |     |     |     |     |     |
| defense-d4-level2-a | 2     | 1 1 2 2     | 100%   | 1,5   | 1     |       | 50%   | 50%  |       |     |     |     |     |     |
| defense-d6-level2-b | 2     | 0 1 2 2 2 3 | 83,3%  | 1,67  | 1     | 16,7% | 16,7% | 50%  | 16,7% |     |     |     |     |     |
| defense-d4-level3-a | 3     | 2 2 2 2     | 100%   | 2     | 1,25  |       |       | 100% |       |     |     |     |     |     |
| defense-d6-level3-b | 3     | 0 3 3 3 3 3 | 83,3%  | 2,5   | 1,25  | 16,7% |       |      | 83,3% |     |     |     |     |     |

## Contra-ataque

| Dado                | Nível | Faces           | Acerto | Média | Valor | 0   | 1   | 2     | 3   | 4     | 5   | 6     | 7   | 8     |
| ------------------- | ----- | --------------- | ------ | ----- | ----- | --- | --- | ----- | --- | ----- | --- | ----- | --- | ----- |
| counter-d4-level1-c | 1     | 0 0 0 3         | 25%    | 0,75  | 0,75  | 75% |     |       | 25% |       |     |       |     |       |
| counter-d8-level1-c | 1     | 0 0 0 0 0 0 2 4 | 25%    | 0,75  | 0,75  | 75% |     | 12,5% |     | 12,5% |     |       |     |       |
| counter-d4-level2-c | 2     | 0 0 0 5         | 25%    | 1,25  | 1,25  | 75% |     |       |     |       | 25% |       |     |       |
| counter-d8-level2-c | 2     | 0 0 0 0 0 0 4 6 | 25%    | 1,25  | 1,25  | 75% |     |       |     | 12,5% |     | 12,5% |     |       |
| counter-d4-level3-c | 3     | 0 0 0 7         | 25%    | 1,75  | 1,75  | 75% |     |       |     |       |     |       | 25% |       |
| counter-d8-level3-c | 3     | 0 0 0 0 0 0 6 8 | 25%    | 1,75  | 1,75  | 75% |     |       |     |       |     | 12,5% |     | 12,5% |
