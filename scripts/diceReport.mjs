import { writeFileSync } from 'node:fs';

import { COMBAT_DICE } from '../src/data/combat/dices.ts';
import {
  BALANCE_ATTACK_FACES,
  BALANCE_DEFENSES,
  diceOdds,
  diceValue,
} from '../src/helper/diceOdds.ts';

const ID_FORMAT = /^(enemy-)?(attack|defense|counter)-d(\d+)-level(\d+)-[a-z]$/;

const REPORTS = [
  {
    file: '../docs/dados-jogador.md',
    title: 'Dados do jogador',
    enemy: false,
  },
  {
    file: '../docs/dados-inimigo.md',
    title: 'Dados do inimigo',
    enemy: true,
  },
];

const SECTIONS = [
  { title: 'Ataque', kind: 'attack' },
  { title: 'Defesa', kind: 'defense' },
  { title: 'Contra-ataque', kind: 'counter' },
];

const percent = (chance) =>
  `${Number((chance * 100).toFixed(1))}%`.replace('.', ',');

const decimal = (value) => String(Number(value.toFixed(2))).replace('.', ',');

const dice = Object.entries(COMBAT_DICE).map(([id, die]) => {
  const [, enemy, , , level] = ID_FORMAT.exec(id) ?? [];
  return {
    id,
    die,
    enemy: Boolean(enemy),
    level: Number(level),
    odds: diceOdds(die.faces),
    value: diceValue(die.kind, die.faces),
  };
});

const values = Array.from(
  { length: Math.max(...dice.flatMap(({ die }) => die.faces)) + 1 },
  (_, value) => value,
);

const columns = [
  'Dado',
  'Nível',
  'Faces',
  'Acerto',
  'Média',
  'Valor',
  ...values,
];

const row = ({ id, die, level, odds, value }) => {
  const chances = new Map(
    odds.valueChances.map(({ value: face, chance }) => [face, chance]),
  );
  const cells = [
    id,
    level,
    die.faces.join(' '),
    percent(odds.hitChance),
    decimal(odds.average),
    decimal(value),
    ...values.map((face) =>
      chances.has(face) ? percent(chances.get(face)) : '',
    ),
  ];
  return `| ${cells.join(' | ')} |`;
};

const table = (enemy, kind) =>
  [
    `| ${columns.join(' | ')} |`,
    `| ${columns.map(() => '---').join(' | ')} |`,
    ...dice
      .filter((entry) => entry.enemy === enemy && entry.die.kind === kind)
      .sort((a, b) => a.level - b.level)
      .map(row),
  ].join('\n');

const intro = [
  'Gerado por `npm run dice:report` a partir de `src/data/combat/dices.ts`. Não edite à mão.',
  '**Acerto** é a chance de tirar mais que 0. **Média** é o valor médio de uma rolagem. As colunas numeradas mostram a chance de tirar cada valor.',
  `**Valor** é o que o balanceamento compara entre dados do mesmo tipo e nível. Ataque: dano médio contra o defensor sem defesa ou com um dado de defesa de referência (${BALANCE_DEFENSES[1].join(' ')}), metade das vezes cada. Todo ataque do mesmo nível tem a mesma Média, e quanto menor o Acerto, maior o Valor. Defesa: dano médio bloqueado de um dado de ataque de referência (${BALANCE_ATTACK_FACES.join(' ')}). Contra-ataque: bloqueio mais o dano devolvido contra o mesmo ataque de referência.`,
];

REPORTS.forEach(({ file, title, enemy }) => {
  const output = new URL(file, import.meta.url);
  const report = [
    `# ${title}`,
    ...intro,
    ...SECTIONS.flatMap((section) => [
      `## ${section.title}`,
      table(enemy, section.kind),
    ]),
  ].join('\n\n');

  writeFileSync(output, `${report}\n`);
  console.log(`Dice report written to ${output.pathname}`);
});
