import type { ISound } from './useSound.types';

export const THEME_BACKGROUND_VOLUME = 0.1;
export const EFFECT_VOLUME = 0.5;

export const SOUND_FILE_THEMES = {
  theme1: 'theme_1.mp3',
  theme2: 'theme_2.mp3',
} as const;

export const DEFAULT_THEME: ISound = {
  soundType: 'theme',
  soundFile: SOUND_FILE_THEMES.theme1,
};

export const SOUND_FILE_BACKGROUNDS = {
  metro: 'background_metro.mp3',
  corporate: 'background_corporate.mp3',
  financial: 'background_financial.mp3',
  peace: 'background_peace.mp3',
  hacking: 'background_hacking.mp3',
  crowdedNoise: 'background_crowded_noise.mp3',
} as const;

export const SOUND_EFFECT_FILE = {
  openCan: 'effect_open_can.wav',
  accessGranted: 'effect_granted.wav',
  accessDenied: 'effect_denied.wav',
  punch: 'effect_punch.mp3',
  alarm: 'effect_alarm.mp3',
  crashCan: 'effect_crash_can.mp3',
  warningOneMoreTry: 'effect_warning_one_more_try.mp3',
  boneCrack: 'effect_bone_break.mp3',
  computerPowerUp: 'effect_computer_power_up.mp3',
  powerDown: 'effect_power_down.mp3',
  metalLatchOpen: 'effect_metal_latch_open.mp3',
  plugCable: 'effect_plug_cable.mp3',
  unplugCable: 'effect_unplug_cable.mp3',
} as const;
