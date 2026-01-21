// Chord definitions and interval data

import { ChordDefinition, ChordType } from './music';

// Interval names for display
export const INTERVAL_NAMES: Record<number, string> = {
  0: 'R',
  1: 'b2',
  2: '2/9',
  3: 'b3/#9',
  4: '3',
  5: '4/11',
  6: 'b5/#11',
  7: '5',
  8: '#5/b13',
  9: '6/13',
  10: 'b7',
  11: '7'
};

// Simplified interval names for voicings
export const DEGREE_NAMES: Record<number, string> = {
  0: 'R',
  1: 'b9',
  2: '9',
  3: '#9',
  4: '3',
  5: '11',
  6: '#11',
  7: '5',
  8: 'b13',
  9: '13',
  10: 'b7',
  11: '7'
};

// Get degree name for a given interval in context
export function getDegreeName(interval: number, chordType: ChordType): string {
  const normalized = ((interval % 12) + 12) % 12;

  // Special cases based on chord type
  if (chordType.includes('m') && normalized === 3) return 'b3';
  if (normalized === 3 && !chordType.includes('m')) return '#9';

  return DEGREE_NAMES[normalized] || `${normalized}`;
}

// Complete chord definitions
export const CHORD_DEFINITIONS: Record<ChordType, ChordDefinition> = {
  'maj7': {
    type: 'maj7',
    name: 'Major 7th',
    shortName: 'maj7',
    intervals: [0, 4, 7, 11], // R 3 5 7
    tensions: [2, 6, 9], // 9, #11, 13
    description: 'Bright, stable major sound with major 7th'
  },
  'maj6': {
    type: 'maj6',
    name: 'Major 6th',
    shortName: '6',
    intervals: [0, 4, 7, 9], // R 3 5 6
    tensions: [2], // 9
    description: 'Classic major sound, less "jazzy" than maj7'
  },
  '6': {
    type: '6',
    name: 'Major 6th',
    shortName: '6',
    intervals: [0, 4, 7, 9], // R 3 5 6
    tensions: [2], // 9
    description: 'Classic major sound, less "jazzy" than maj7'
  },
  'm7': {
    type: 'm7',
    name: 'Minor 7th',
    shortName: 'm7',
    intervals: [0, 3, 7, 10], // R b3 5 b7
    tensions: [2, 5, 9], // 9, 11, 13
    description: 'Warm minor sound, very common in jazz'
  },
  'm6': {
    type: 'm6',
    name: 'Minor 6th',
    shortName: 'm6',
    intervals: [0, 3, 7, 9], // R b3 5 6
    tensions: [2], // 9
    description: 'Minor with major 6th, tonic minor sound'
  },
  'mMaj7': {
    type: 'mMaj7',
    name: 'Minor Major 7th',
    shortName: 'm(maj7)',
    intervals: [0, 3, 7, 11], // R b3 5 7
    tensions: [2, 9], // 9, 13
    description: 'Dramatic minor sound with major 7th tension'
  },
  '7': {
    type: '7',
    name: 'Dominant 7th',
    shortName: '7',
    intervals: [0, 4, 7, 10], // R 3 5 b7
    tensions: [2, 9], // 9, 13
    description: 'The classic V chord, creates tension/resolution'
  },
  '7b9': {
    type: '7b9',
    name: 'Dominant 7 flat 9',
    shortName: '7(b9)',
    intervals: [0, 4, 7, 10, 1], // R 3 5 b7 b9
    tensions: [8], // b13
    description: 'Dark dominant, common on V to minor'
  },
  '7#9': {
    type: '7#9',
    name: 'Dominant 7 sharp 9',
    shortName: '7(#9)',
    intervals: [0, 4, 7, 10, 3], // R 3 5 b7 #9
    tensions: [8], // b13
    description: 'The "Hendrix chord", bluesy and aggressive'
  },
  '7#5': {
    type: '7#5',
    name: 'Dominant 7 sharp 5',
    shortName: '7(#5)',
    intervals: [0, 4, 8, 10], // R 3 #5 b7
    tensions: [2, 1], // 9, b9
    description: 'Augmented dominant, creates strong pull'
  },
  '7b13': {
    type: '7b13',
    name: 'Dominant 7 flat 13',
    shortName: '7(b13)',
    intervals: [0, 4, 7, 10, 8], // R 3 5 b7 b13
    tensions: [2], // 9
    description: 'Rich altered sound, common approach chord'
  },
  '7alt': {
    type: '7alt',
    name: 'Altered Dominant',
    shortName: '7alt',
    intervals: [0, 4, 8, 10, 1, 3], // R 3 #5 b7 b9 #9
    tensions: [],
    description: 'Fully altered dominant, maximum tension'
  },
  'm7b5': {
    type: 'm7b5',
    name: 'Half-Diminished',
    shortName: 'ø7',
    intervals: [0, 3, 6, 10], // R b3 b5 b7
    tensions: [2, 5, 8], // 9, 11, b13
    description: 'The ii chord in minor keys'
  },
  'dim7': {
    type: 'dim7',
    name: 'Diminished 7th',
    shortName: '°7',
    intervals: [0, 3, 6, 9], // R b3 b5 bb7
    tensions: [],
    description: 'Symmetric, can resolve multiple ways'
  },
  '7sus': {
    type: '7sus',
    name: 'Dominant 7 sus4',
    shortName: '7sus4',
    intervals: [0, 5, 7, 10], // R 4 5 b7
    tensions: [2, 9], // 9, 13
    description: 'Suspended dominant, delays resolution'
  },
  '9sus': {
    type: '9sus',
    name: 'Dominant 9 sus4',
    shortName: '9sus4',
    intervals: [0, 5, 7, 10, 2], // R 4 5 b7 9
    tensions: [9], // 13
    description: 'Rich suspended sound with 9th'
  }
};

// Get all chord types grouped by category
export const CHORD_CATEGORIES = {
  'Major': ['maj7', 'maj6', '6'] as ChordType[],
  'Minor': ['m7', 'm6', 'mMaj7'] as ChordType[],
  'Dominant': ['7', '7b9', '7#9', '7#5', '7b13', '7alt'] as ChordType[],
  'Diminished': ['m7b5', 'dim7'] as ChordType[],
  'Suspended': ['7sus', '9sus'] as ChordType[]
};
