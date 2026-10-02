export type CombatDieKind = 'attack' | 'defense';
export type CombatDieSides = 4 | 6 | 8;
export type CombatSlots = Array<string | null>;

export type ICombatDie = {
  id: string;
  sides: CombatDieSides;
  kind: CombatDieKind;
  faces: number[];
};

export type ICombatDieDefinition = Omit<ICombatDie, 'id'>;

export type ICombatDieRoll = {
  faceIndex: number;
  value: number;
};

export type ICombatInitiative = {
  player: number;
  enemy: number;
  playerFirst: boolean;
};

export type ICombatExchangeResult = {
  attack: number;
  defense: number;
  damage: number;
};

export type ICombatPiles = {
  hand: ICombatDie[];
  drawPile: ICombatDie[];
  discard: ICombatDie[];
};

const INITIATIVE_MAX_REROLLS = 20;

export type IWindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const emptyCombatSlots = (count: number): CombatSlots =>
  Array.from({ length: count }, () => null);

export const formatFace = (value: number) => (value === 0 ? '0' : `+${value}`);

export const formatFaceMark = (value: number) =>
  value === 0 ? '·' : `${value}`;
export const restFace = (die: ICombatDie) =>
  die.faces.find((value) => value > 0) ?? die.faces[0] ?? 0;

export const rollDie = (
  die: ICombatDie,
  random: () => number = Math.random,
): ICombatDieRoll => {
  const faceIndex = Math.min(
    die.faces.length - 1,
    Math.floor(random() * die.faces.length),
  );
  return {
    faceIndex,
    value: die.faces[faceIndex] ?? 0,
  };
};

export const selectedDice = (dice: ICombatDie[], slots: CombatSlots) =>
  slots.flatMap((id) => {
    const die = dice.find((item) => item.id === id);
    return die ? [die] : [];
  });

export const placeDieOnSlot = (
  slots: CombatSlots,
  dieId: string,
  slotIndex: number,
): CombatSlots => {
  if (slotIndex < 0 || slotIndex >= slots.length) {
    return slots;
  }

  const next: CombatSlots = [...slots];
  const fromIndex = next.findIndex((id) => id === dieId);
  const occupant = next[slotIndex];

  if (fromIndex === slotIndex) {
    return slots;
  }

  if (fromIndex >= 0) {
    next[fromIndex] = occupant;
    next[slotIndex] = dieId;
    return next;
  }

  next[slotIndex] = dieId;
  return next;
};

export const removeDieFromSlots = (
  slots: CombatSlots,
  dieId: string,
): CombatSlots => {
  const next: CombatSlots = [...slots];
  const fromIndex = next.findIndex((id) => id === dieId);
  if (fromIndex < 0) {
    return slots;
  }
  next[fromIndex] = null;
  return next;
};

export const handSize = (cardsInHand: number, numOfDices: number) =>
  Math.max(0, Math.min(cardsInHand, numOfDices));

export const toCards = (dice: ICombatDie[]): ICombatDie[] =>
  dice.map((die, index) => ({ ...die, id: `${die.id}#${index}` }));

export const shuffle = <T>(items: T[], random: () => number = Math.random) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.min(index, Math.floor(random() * (index + 1)));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
};

export const drawCards = (
  piles: ICombatPiles,
  count: number,
  random: () => number = Math.random,
): ICombatPiles => {
  const hand = [...piles.hand];
  let { drawPile, discard } = piles;
  for (let drawn = 0; drawn < count; drawn += 1) {
    if (drawPile.length === 0) {
      if (discard.length === 0) {
        break;
      }
      drawPile = shuffle(discard, random);
      discard = [];
    }
    const [card, ...rest] = drawPile;
    hand.push(card);
    drawPile = rest;
  }
  return { hand, drawPile, discard };
};

export const dealHand = (
  deck: ICombatDie[],
  size: number,
  random: () => number = Math.random,
): ICombatPiles =>
  drawCards(
    { hand: [], drawPile: shuffle(deck, random), discard: [] },
    size,
    random,
  );

export const playCards = (
  piles: ICombatPiles,
  usedIds: string[],
  size: number,
  random: () => number = Math.random,
): ICombatPiles => {
  const used = piles.hand.filter((card) => usedIds.includes(card.id));
  const hand = piles.hand.filter((card) => !usedIds.includes(card.id));
  return drawCards(
    { hand, drawPile: piles.drawPile, discard: [...piles.discard, ...used] },
    Math.max(0, size - hand.length),
    random,
  );
};

export const rollD20 = (random: () => number = Math.random) =>
  Math.min(20, Math.floor(random() * 20) + 1);

export const rollInitiative = (
  random: () => number = Math.random,
): ICombatInitiative => {
  for (let attempt = 0; attempt < INITIATIVE_MAX_REROLLS; attempt += 1) {
    const player = rollD20(random);
    const enemy = rollD20(random);
    if (player !== enemy) {
      return { player, enemy, playerFirst: player > enemy };
    }
  }
  return { player: 20, enemy: 1, playerFirst: true };
};

export const drawDice = (
  deck: ICombatDie[],
  count: number,
  random: () => number = Math.random,
): ICombatDie[] => {
  const pool = toCards(deck);
  const drawn: ICombatDie[] = [];
  while (drawn.length < count && pool.length > 0) {
    const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
    drawn.push(...pool.splice(index, 1));
  }
  return drawn;
};

export const diceOfKind = (dice: ICombatDie[], kind: CombatDieKind) =>
  dice.filter((die) => die.kind === kind);

export const rollDice = (
  dice: ICombatDie[],
  random: () => number = Math.random,
): Record<string, number> =>
  Object.fromEntries(dice.map((die) => [die.id, rollDie(die, random).value]));

const sumRolls = (dice: ICombatDie[], rolls: Record<string, number>) =>
  dice.reduce((total, die) => total + (rolls[die.id] ?? 0), 0);

export const resolveExchange = (
  attackDice: ICombatDie[],
  defenseDice: ICombatDie[],
  rolls: Record<string, number>,
): ICombatExchangeResult => {
  const attack = sumRolls(attackDice, rolls);
  const defense = sumRolls(defenseDice, rolls);
  return { attack, defense, damage: Math.max(0, attack - defense) };
};

export const containsPoint = (
  rect: IWindowRect | null | undefined,
  x: number,
  y: number,
) =>
  Boolean(
    rect &&
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height,
  );

export const hitSlotIndex = (
  rects: Array<IWindowRect | null | undefined>,
  x: number,
  y: number,
) => rects.findIndex((rect) => containsPoint(rect, x, y));

const hashId = (id: string) =>
  id.split('').reduce((total, char) => total + char.charCodeAt(0), 0);

export const rollDurationMs = (die: ICombatDie) =>
  1320 + die.sides * 95 + (hashId(die.id) % 380);

export const rollDelayMs = (index: number) => index * 140;

export const rollTurnCount = (die: ICombatDie) =>
  2 + (die.sides === 8 ? 2 : die.sides === 6 ? 1 : 0);
