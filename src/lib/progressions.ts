// Progression templates and generator

import { ProgressionTemplate, RealizedChord, NoteName, getDegreeRoot, formatChordSymbol } from './music';

// Re-export for convenience
export type { RealizedChord } from './music';

// All progression templates
export const PROGRESSION_TEMPLATES: ProgressionTemplate[] = [
  {
    id: 'ii-v-i-major',
    name: 'ii-V-I (Major)',
    shortName: 'ii-V-I',
    chords: [
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7', symbol: 'V7' },
      { degree: 1, type: 'maj7', symbol: 'Imaj7' }
    ],
    description: 'The most common jazz progression'
  },
  {
    id: 'ii-v-i-minor',
    name: 'ii-V-i (Minor)',
    shortName: 'ii-V-i',
    chords: [
      { degree: 2, type: 'm7b5', symbol: 'iiø7' },
      { degree: 5, type: '7b9', symbol: 'V7b9' },
      { degree: 1, type: 'm7', symbol: 'im7' }
    ],
    description: 'Minor key ii-V-i with altered dominant'
  },
  {
    id: 'i-vi-ii-v',
    name: 'I-vi-ii-V (Turnaround)',
    shortName: 'Turnaround',
    chords: [
      { degree: 1, type: 'maj7', symbol: 'Imaj7' },
      { degree: 6, type: 'm7', symbol: 'vim7' },
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7', symbol: 'V7' }
    ],
    description: 'Classic turnaround progression'
  },
  {
    id: 'iii-vi-ii-v',
    name: 'iii-vi-ii-V',
    shortName: 'iii-vi-ii-V',
    chords: [
      { degree: 3, type: 'm7', symbol: 'iiim7' },
      { degree: 6, type: '7', symbol: 'VI7' },
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7', symbol: 'V7' }
    ],
    description: 'Extended turnaround with secondary dominant'
  },
  {
    id: 'backdoor',
    name: 'Backdoor (iv-bVII-I)',
    shortName: 'Backdoor',
    chords: [
      { degree: 4, type: 'm7', symbol: 'ivm7' },
      { degree: 7, type: '7', symbol: 'bVII7' }, // flat 7
      { degree: 1, type: 'maj7', symbol: 'Imaj7' }
    ],
    description: 'Backdoor resolution via bVII'
  },
  {
    id: 'sus-cadence',
    name: 'Sus Cadence (ii-V9sus-I)',
    shortName: 'Sus Cadence',
    chords: [
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '9sus', symbol: 'V9sus' },
      { degree: 1, type: 'maj7', symbol: 'Imaj7' }
    ],
    description: 'Smooth sus4 resolution'
  },
  {
    id: 'rhythm-changes-a',
    name: 'Rhythm Changes A',
    shortName: 'Rhythm A',
    chords: [
      { degree: 1, type: 'maj7', symbol: 'Imaj7' },
      { degree: 6, type: '7', symbol: 'VI7' },
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7', symbol: 'V7' },
      { degree: 1, type: 'maj7', symbol: 'Imaj7' },
      { degree: 6, type: '7', symbol: 'VI7' },
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7', symbol: 'V7' }
    ],
    description: 'First 8 bars of rhythm changes'
  },
  {
    id: 'minor-blues',
    name: 'Minor Blues (first 4)',
    shortName: 'Minor Blues',
    chords: [
      { degree: 1, type: 'm7', symbol: 'im7' },
      { degree: 4, type: 'm7', symbol: 'ivm7' },
      { degree: 1, type: 'm7', symbol: 'im7' },
      { degree: 1, type: 'm7', symbol: 'im7' }
    ],
    description: 'First 4 bars of minor blues'
  },
  {
    id: 'coltrane-turnaround',
    name: 'Coltrane Changes',
    shortName: 'Coltrane',
    chords: [
      { degree: 1, type: 'maj7', symbol: 'Imaj7' },
      { degree: 5, type: '7', symbol: 'V7/bVI' },
      { degree: 1, type: 'maj7', symbol: 'bVImaj7' }, // Will need special handling
      { degree: 5, type: '7', symbol: 'V7' }
    ],
    description: 'Giant Steps-style changes (simplified)'
  },
  {
    id: 'altered-ii-v-i',
    name: 'Altered ii-V-I',
    shortName: 'Altered ii-V-I',
    chords: [
      { degree: 2, type: 'm7', symbol: 'iim7' },
      { degree: 5, type: '7alt', symbol: 'V7alt' },
      { degree: 1, type: 'maj7', symbol: 'Imaj7' }
    ],
    description: 'ii-V-I with fully altered dominant'
  },
  {
    id: 'minor-cliche',
    name: 'Minor Line Cliche',
    shortName: 'Minor Cliche',
    chords: [
      { degree: 1, type: 'm7', symbol: 'im7' },
      { degree: 1, type: 'mMaj7', symbol: 'im(maj7)' },
      { degree: 1, type: 'm7', symbol: 'im7' },
      { degree: 1, type: 'm6', symbol: 'im6' }
    ],
    description: 'Descending chromatic line on minor'
  }
];

// Realize a progression template in a specific key
export function realizeProgression(
  template: ProgressionTemplate,
  key: NoteName,
  preferFlats: boolean = true
): RealizedChord[] {
  return template.chords.map(chord => {
    let root: NoteName;

    // Special handling for flat degrees (backdoor bVII)
    if (template.id === 'backdoor' && chord.degree === 7) {
      // bVII is a whole step below the tonic
      root = getDegreeRoot(key, 7, preferFlats);
      // Adjust down a half step for flat 7
      const noteIndex = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'].indexOf(root);
      const flatNotes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
      root = flatNotes[(noteIndex - 1 + 12) % 12] as NoteName;
    } else {
      root = getDegreeRoot(key, chord.degree, preferFlats);
    }

    return {
      root,
      type: chord.type,
      symbol: formatChordSymbol(root, chord.type),
      degree: chord.degree
    };
  });
}

// Extend a progression to fill a target number of bars
export function extendProgression(
  chords: RealizedChord[],
  targetBars: number
): RealizedChord[] {
  if (chords.length === 0) return [];
  if (chords.length >= targetBars) return chords.slice(0, targetBars);

  const result: RealizedChord[] = [];
  while (result.length < targetBars) {
    const remaining = targetBars - result.length;
    const toAdd = chords.slice(0, Math.min(remaining, chords.length));
    result.push(...toAdd);
  }
  return result;
}

// Get a random progression template
export function getRandomTemplate(): ProgressionTemplate {
  const index = Math.floor(Math.random() * PROGRESSION_TEMPLATES.length);
  return PROGRESSION_TEMPLATES[index];
}

// Get progression by ID
export function getProgressionById(id: string): ProgressionTemplate | undefined {
  return PROGRESSION_TEMPLATES.find(p => p.id === id);
}
