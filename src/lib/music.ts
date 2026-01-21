// Core music theory constants and types

export const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
export const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;

export type NoteName = typeof NOTE_NAMES_SHARP[number] | typeof NOTE_NAMES_FLAT[number];

// Chord types we support
export type ChordType =
  | 'maj7' | 'maj6' | '6'
  | 'm7' | 'm6' | 'mMaj7'
  | '7' | '7b9' | '7#9' | '7#5' | '7b13' | '7alt'
  | 'm7b5' | 'dim7'
  | '7sus' | '9sus';

// Degree in a scale (0-11 semitones from root)
export type ScaleDegree = number;

// A note with octave
export interface Note {
  name: NoteName;
  octave: number;
  midi: number; // MIDI note number (C4 = 60)
}

// Chord definition
export interface ChordDefinition {
  type: ChordType;
  name: string;
  shortName: string;
  intervals: ScaleDegree[]; // semitones from root
  tensions: ScaleDegree[]; // available tensions
  description: string;
}

// Voicing recipe
export interface VoicingRecipe {
  id: string;
  name: string;
  style: 'shell' | 'rootless-a' | 'rootless-b' | 'quartal' | 'full';
  lhIntervals: ScaleDegree[]; // intervals for LH
  rhIntervals: ScaleDegree[]; // intervals for RH
  description: string;
}

// Realized voicing with actual notes
export interface Voicing {
  chordRoot: NoteName;
  chordType: ChordType;
  recipe: VoicingRecipe;
  lhNotes: Note[];
  rhNotes: Note[];
}

// Progression chord
export interface ProgressionChord {
  degree: number; // scale degree (1-7)
  type: ChordType;
  symbol: string; // display symbol like "iim7"
}

// Realized chord in a key
export interface RealizedChord {
  root: NoteName;
  type: ChordType;
  symbol: string; // e.g., "Dm7"
  degree: number;
  voicing?: Voicing;
}

// Progression template
export interface ProgressionTemplate {
  id: string;
  name: string;
  shortName: string;
  chords: ProgressionChord[];
  description: string;
}

// Get note name from MIDI number
export function midiToNote(midi: number, preferFlats: boolean = true): Note {
  const noteNames = preferFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return {
    name: noteNames[noteIndex],
    octave,
    midi
  };
}

// Get MIDI number from note name and octave
export function noteToMidi(name: NoteName, octave: number): number {
  const sharpIndex = NOTE_NAMES_SHARP.indexOf(name as typeof NOTE_NAMES_SHARP[number]);
  const flatIndex = NOTE_NAMES_FLAT.indexOf(name as typeof NOTE_NAMES_FLAT[number]);
  const noteIndex = sharpIndex >= 0 ? sharpIndex : flatIndex;
  return (octave + 1) * 12 + noteIndex;
}

// Get note index (0-11)
export function getNoteIndex(name: NoteName): number {
  const sharpIndex = NOTE_NAMES_SHARP.indexOf(name as typeof NOTE_NAMES_SHARP[number]);
  if (sharpIndex >= 0) return sharpIndex;
  return NOTE_NAMES_FLAT.indexOf(name as typeof NOTE_NAMES_FLAT[number]);
}

// Transpose a note name by semitones
export function transposeNoteName(name: NoteName, semitones: number, preferFlats: boolean = true): NoteName {
  const noteNames = preferFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  const index = getNoteIndex(name);
  const newIndex = ((index + semitones) % 12 + 12) % 12;
  return noteNames[newIndex];
}

// Get the root note for a scale degree in a key
export function getDegreeRoot(key: NoteName, degree: number, preferFlats: boolean = true): NoteName {
  // Major scale intervals: W W H W W W H
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
  const semitones = majorScaleIntervals[(degree - 1) % 7];
  return transposeNoteName(key, semitones, preferFlats);
}

// Format a chord symbol
export function formatChordSymbol(root: NoteName, type: ChordType): string {
  const typeSymbols: Record<ChordType, string> = {
    'maj7': 'maj7',
    'maj6': '6',
    '6': '6',
    'm7': 'm7',
    'm6': 'm6',
    'mMaj7': 'm(maj7)',
    '7': '7',
    '7b9': '7(b9)',
    '7#9': '7(#9)',
    '7#5': '7(#5)',
    '7b13': '7(b13)',
    '7alt': '7alt',
    'm7b5': 'm7b5',
    'dim7': '°7',
    '7sus': '7sus4',
    '9sus': '9sus4'
  };
  return `${root}${typeSymbols[type]}`;
}

// Degree symbols for progressions
export function formatDegreeSymbol(degree: number, type: ChordType): string {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const roman = romanNumerals[(degree - 1) % 7];

  // Minor/diminished chords use lowercase
  const isMinor = ['m7', 'm6', 'mMaj7', 'm7b5', 'dim7'].includes(type);
  const numeral = isMinor ? roman.toLowerCase() : roman;

  const suffixes: Partial<Record<ChordType, string>> = {
    'maj7': 'maj7',
    '6': '6',
    'm7': 'm7',
    'm6': 'm6',
    'mMaj7': 'm(maj7)',
    '7': '7',
    '7b9': '7(b9)',
    '7#9': '7(#9)',
    '7#5': '7(#5)',
    '7b13': '7(b13)',
    '7alt': '7alt',
    'm7b5': 'ø7',
    'dim7': '°7',
    '7sus': '7sus',
    '9sus': '9sus'
  };

  return `${numeral}${suffixes[type] || ''}`;
}
