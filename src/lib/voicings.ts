// Voicing recipes for different chord types

import { ChordType, VoicingRecipe } from './music';

// Re-export VoicingRecipe type for convenience
export type { VoicingRecipe } from './music';

// Voicing recipes organized by chord type
export const VOICING_RECIPES: Record<ChordType, VoicingRecipe[]> = {
  'maj7': [
    {
      id: 'maj7-shell',
      name: 'Shell (3-7)',
      style: 'shell',
      lhIntervals: [4, 11], // 3, 7
      rhIntervals: [2, 7], // 9, 5
      description: 'Basic guide tones, essential maj7 sound'
    },
    {
      id: 'maj7-rootless-a',
      name: 'Rootless A',
      style: 'rootless-a',
      lhIntervals: [4, 7, 11, 2], // 3, 5, 7, 9
      rhIntervals: [6], // #11
      description: 'Classic Bill Evans voicing'
    },
    {
      id: 'maj7-rootless-b',
      name: 'Rootless B',
      style: 'rootless-b',
      lhIntervals: [11, 2, 4, 7], // 7, 9, 3, 5
      rhIntervals: [9], // 13
      description: 'Inverted rootless voicing'
    },
    {
      id: 'maj7-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [4, 11, 2], // 3, 7, 9
      description: 'With root in bass'
    }
  ],
  'maj6': [
    {
      id: 'maj6-shell',
      name: 'Shell (3-6)',
      style: 'shell',
      lhIntervals: [4, 9], // 3, 6
      rhIntervals: [2, 7], // 9, 5
      description: 'Guide tones for 6th chord'
    },
    {
      id: 'maj6-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [4, 9, 2], // 3, 6, 9
      description: 'Complete 6/9 sound'
    }
  ],
  '6': [
    {
      id: '6-shell',
      name: 'Shell (3-6)',
      style: 'shell',
      lhIntervals: [4, 9], // 3, 6
      rhIntervals: [2, 7], // 9, 5
      description: 'Guide tones for 6th chord'
    },
    {
      id: '6-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [4, 9, 2], // 3, 6, 9
      description: 'Complete 6/9 sound'
    }
  ],
  'm7': [
    {
      id: 'm7-shell',
      name: 'Shell (b3-b7)',
      style: 'shell',
      lhIntervals: [3, 10], // b3, b7
      rhIntervals: [2, 7], // 9, 5
      description: 'Essential minor 7th guide tones'
    },
    {
      id: 'm7-rootless-a',
      name: 'Rootless A',
      style: 'rootless-a',
      lhIntervals: [3, 7, 10, 2], // b3, 5, b7, 9
      rhIntervals: [5], // 11
      description: 'Rootless voicing for ii chord'
    },
    {
      id: 'm7-rootless-b',
      name: 'Rootless B',
      style: 'rootless-b',
      lhIntervals: [10, 2, 3, 7], // b7, 9, b3, 5
      rhIntervals: [9], // 13
      description: 'Inverted rootless minor'
    },
    {
      id: 'm7-quartal',
      name: 'Quartal',
      style: 'quartal',
      lhIntervals: [10, 2, 7], // b7, 9, 5
      rhIntervals: [3, 10], // b3, b7
      description: 'Modern stacked 4ths sound'
    },
    {
      id: 'm7-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [3, 10, 2], // b3, b7, 9
      description: 'With root in bass'
    }
  ],
  'm6': [
    {
      id: 'm6-shell',
      name: 'Shell (b3-6)',
      style: 'shell',
      lhIntervals: [3, 9], // b3, 6
      rhIntervals: [2, 7], // 9, 5
      description: 'Minor 6th guide tones'
    },
    {
      id: 'm6-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [3, 9, 2], // b3, 6, 9
      description: 'Tonic minor sound'
    }
  ],
  'mMaj7': [
    {
      id: 'mMaj7-shell',
      name: 'Shell (b3-7)',
      style: 'shell',
      lhIntervals: [3, 11], // b3, 7
      rhIntervals: [2, 7], // 9, 5
      description: 'Dramatic minor major 7 sound'
    },
    {
      id: 'mMaj7-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [3, 11, 2], // b3, 7, 9
      description: 'With root, cinematic'
    }
  ],
  '7': [
    {
      id: '7-shell',
      name: 'Shell (3-b7)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [2, 9], // 9, 13
      description: 'Essential dominant guide tones'
    },
    {
      id: '7-shell-inv',
      name: 'Shell (b7-3)',
      style: 'shell',
      lhIntervals: [10, 4], // b7, 3
      rhIntervals: [2, 9], // 9, 13
      description: 'Inverted shell voicing'
    },
    {
      id: '7-rootless-a',
      name: 'Rootless A',
      style: 'rootless-a',
      lhIntervals: [4, 9, 10, 2], // 3, 13, b7, 9
      rhIntervals: [],
      description: 'Classic dominant rootless'
    },
    {
      id: '7-rootless-b',
      name: 'Rootless B',
      style: 'rootless-b',
      lhIntervals: [10, 2, 4, 9], // b7, 9, 3, 13
      rhIntervals: [],
      description: 'Inverted dominant rootless'
    },
    {
      id: '7-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [4, 10, 2], // 3, b7, 9
      description: 'With root in bass'
    }
  ],
  '7b9': [
    {
      id: '7b9-shell',
      name: 'Shell (3-b7-b9)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [1, 8], // b9, b13
      description: 'Dark dominant sound'
    },
    {
      id: '7b9-rootless',
      name: 'Rootless',
      style: 'rootless-a',
      lhIntervals: [4, 8, 10, 1], // 3, b13, b7, b9
      rhIntervals: [],
      description: 'V to minor voicing'
    },
    {
      id: '7b9-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0], // R
      rhIntervals: [4, 10, 1, 8], // 3, b7, b9, b13
      description: 'Complete altered sound'
    }
  ],
  '7#9': [
    {
      id: '7#9-shell',
      name: 'Shell (3-b7-#9)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [3, 8], // #9, b13
      description: 'The Hendrix chord'
    },
    {
      id: '7#9-rootless',
      name: 'Rootless',
      style: 'rootless-a',
      lhIntervals: [4, 8, 10, 3], // 3, b13, b7, #9
      rhIntervals: [],
      description: 'Bluesy altered voicing'
    },
    {
      id: '7#9-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0], // R
      rhIntervals: [4, 10, 3], // 3, b7, #9
      description: 'Powerful blues sound'
    }
  ],
  '7#5': [
    {
      id: '7#5-shell',
      name: 'Shell (3-b7)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [8, 2], // #5, 9
      description: 'Augmented dominant'
    },
    {
      id: '7#5-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 8], // R, #5
      rhIntervals: [4, 10, 2], // 3, b7, 9
      description: 'Strong augmented pull'
    }
  ],
  '7b13': [
    {
      id: '7b13-shell',
      name: 'Shell (3-b7-b13)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [2, 8], // 9, b13
      description: 'Rich approach sound'
    },
    {
      id: '7b13-rootless',
      name: 'Rootless',
      style: 'rootless-a',
      lhIntervals: [4, 8, 10, 2], // 3, b13, b7, 9
      rhIntervals: [],
      description: 'Smooth voice leading option'
    },
    {
      id: '7b13-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0], // R
      rhIntervals: [4, 10, 2, 8], // 3, b7, 9, b13
      description: 'Complete b13 color'
    }
  ],
  '7alt': [
    {
      id: '7alt-shell',
      name: 'Shell (3-b7)',
      style: 'shell',
      lhIntervals: [4, 10], // 3, b7
      rhIntervals: [1, 8], // b9, #5
      description: 'Maximum tension shell'
    },
    {
      id: '7alt-rootless',
      name: 'Rootless',
      style: 'rootless-a',
      lhIntervals: [4, 8, 10, 1], // 3, #5, b7, b9
      rhIntervals: [3], // #9
      description: 'Full altered voicing'
    },
    {
      id: '7alt-tritone',
      name: 'Tritone Sub',
      style: 'rootless-b',
      lhIntervals: [10, 1, 4, 8], // b7, b9, 3, #5
      rhIntervals: [3], // #9
      description: 'Think tritone substitution'
    }
  ],
  'm7b5': [
    {
      id: 'm7b5-shell',
      name: 'Shell (b3-b7)',
      style: 'shell',
      lhIntervals: [3, 10], // b3, b7
      rhIntervals: [6, 2], // b5, 9
      description: 'Half-diminished guide tones'
    },
    {
      id: 'm7b5-rootless',
      name: 'Rootless',
      style: 'rootless-a',
      lhIntervals: [3, 6, 10, 2], // b3, b5, b7, 9
      rhIntervals: [5], // 11
      description: 'ii chord in minor'
    },
    {
      id: 'm7b5-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 6], // R, b5
      rhIntervals: [3, 10, 2], // b3, b7, 9
      description: 'With root and b5'
    }
  ],
  'dim7': [
    {
      id: 'dim7-shell',
      name: 'Shell',
      style: 'shell',
      lhIntervals: [3, 9], // b3, bb7
      rhIntervals: [6, 0], // b5, R
      description: 'Symmetric diminished'
    },
    {
      id: 'dim7-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 6], // R, b5
      rhIntervals: [3, 9], // b3, bb7
      description: 'Complete dim7 stack'
    }
  ],
  '7sus': [
    {
      id: '7sus-shell',
      name: 'Shell (4-b7)',
      style: 'shell',
      lhIntervals: [5, 10], // 4, b7
      rhIntervals: [2, 7], // 9, 5
      description: 'Suspended guide tones'
    },
    {
      id: '7sus-quartal',
      name: 'Quartal',
      style: 'quartal',
      lhIntervals: [10, 2, 7], // b7, 9, 5
      rhIntervals: [5, 0], // 4, R
      description: 'Stacked 4ths, very "So What"'
    },
    {
      id: '7sus-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [5, 10, 2], // 4, b7, 9
      description: 'With root'
    }
  ],
  '9sus': [
    {
      id: '9sus-shell',
      name: 'Shell (4-b7-9)',
      style: 'shell',
      lhIntervals: [5, 10], // 4, b7
      rhIntervals: [2, 9], // 9, 13
      description: 'Rich suspended sound'
    },
    {
      id: '9sus-quartal',
      name: 'Quartal',
      style: 'quartal',
      lhIntervals: [10, 2, 7], // b7, 9, 5
      rhIntervals: [5, 9], // 4, 13
      description: 'Open quartal voicing'
    },
    {
      id: '9sus-full',
      name: 'Full Voicing',
      style: 'full',
      lhIntervals: [0, 7], // R, 5
      rhIntervals: [5, 10, 2, 9], // 4, b7, 9, 13
      description: 'Complete 9sus4 sound'
    }
  ]
};

// Get voicing recipe by ID
export function getVoicingRecipe(id: string): VoicingRecipe | undefined {
  for (const recipes of Object.values(VOICING_RECIPES)) {
    const found = recipes.find(r => r.id === id);
    if (found) return found;
  }
  return undefined;
}

// Get voicings for a chord type filtered by style
export function getVoicingsForChord(
  chordType: ChordType,
  styles?: VoicingRecipe['style'][]
): VoicingRecipe[] {
  const recipes = VOICING_RECIPES[chordType] || [];
  if (!styles || styles.length === 0) return recipes;
  return recipes.filter(r => styles.includes(r.style));
}

// Style display names
export const STYLE_NAMES: Record<VoicingRecipe['style'], string> = {
  'shell': 'Shell/Guide Tones',
  'rootless-a': 'Rootless Type A',
  'rootless-b': 'Rootless Type B',
  'quartal': 'Quartal/Sus',
  'full': 'Full (with Root)'
};
