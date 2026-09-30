export type CombatDieKind = 'attack' | 'defense';
export type CombatDieSides = 4 | 6 | 8;
export type CombatSlotIndex = 0 | 1 | 2;
export type CombatSlots = [string | null, string | null, string | null];

export type ICombatDie = {
  id: string;
  sides: CombatDieSides;
  kind: CombatDieKind;
  faces: number[];
};

export type ICombatDieRoll = {
  faceIndex: number;
  value: number;
};

export type IWindowRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const emptyCombatSlots = (): CombatSlots => [null, null, null];

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
  if (slotIndex < 0 || slotIndex > 2) {
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

export const summarizeCombatRoll = (
  dice: ICombatDie[],
  rolls: Record<string, number>,
) => {
  const values = dice.map((die) => rolls[die.id] ?? 0);
  const attack = dice
    .filter((die) => die.kind === 'attack')
    .reduce((total, die) => total + (rolls[die.id] ?? 0), 0);
  const defense = dice
    .filter((die) => die.kind === 'defense')
    .reduce((total, die) => total + (rolls[die.id] ?? 0), 0);

  return {
    values,
    attack,
    defense,
    total: attack + defense,
    hits: values.filter((value) => value > 0).length,
    misses: values.filter((value) => value === 0).length,
  };
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
