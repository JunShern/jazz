// Voicing engine - realizes voicings with actual notes and voice leading

import {
  NoteName,
  Note,
  ChordType,
  Voicing,
  VoicingRecipe,
  midiToNote,
  getNoteIndex,
} from './music';
import { VOICING_RECIPES, getVoicingsForChord } from './voicings';

// Range constraints (MIDI notes)
const LH_LOW = 36;  // C2
const LH_HIGH = 55; // G3
const RH_LOW = 55;  // G3
const RH_HIGH = 84; // C6

// Realize a single voicing with actual notes
export function realizeVoicing(
  root: NoteName,
  chordType: ChordType,
  recipe: VoicingRecipe,
  preferFlats: boolean = true,
  lhAnchor: number = 48, // C3 default LH center
  rhAnchor: number = 67  // G4 default RH center
): Voicing {
  const rootIndex = getNoteIndex(root);

  // Calculate LH notes
  const lhNotes: Note[] = recipe.lhIntervals.map((interval, i) => {
    const noteIndex = (rootIndex + interval) % 12;
    // Start from anchor and find closest octave
    let midi = lhAnchor + (noteIndex - (lhAnchor % 12));
    // Adjust to be within range
    while (midi < LH_LOW) midi += 12;
    while (midi > LH_HIGH) midi -= 12;
    // Spread notes if multiple (avoid clusters)
    if (i > 0 && recipe.lhIntervals.length > 1) {
      const prevMidi = lhNotes[i - 1]?.midi;
      if (prevMidi && midi <= prevMidi) {
        midi += 12;
        if (midi > LH_HIGH) midi -= 24;
      }
    }
    return midiToNote(midi, preferFlats);
  });

  // Calculate RH notes
  const rhNotes: Note[] = recipe.rhIntervals.map((interval, i) => {
    const noteIndex = (rootIndex + interval) % 12;
    let midi = rhAnchor + (noteIndex - (rhAnchor % 12));
    while (midi < RH_LOW) midi += 12;
    while (midi > RH_HIGH) midi -= 12;
    // Spread notes
    if (i > 0 && recipe.rhIntervals.length > 1) {
      const prevMidi = rhNotes[i - 1]?.midi;
      if (prevMidi && midi <= prevMidi) {
        midi += 12;
        if (midi > RH_HIGH) midi -= 24;
      }
    }
    return midiToNote(midi, preferFlats);
  });

  // Sort notes by pitch
  lhNotes.sort((a, b) => a.midi - b.midi);
  rhNotes.sort((a, b) => a.midi - b.midi);

  return {
    chordRoot: root,
    chordType,
    recipe,
    lhNotes,
    rhNotes
  };
}

// Calculate voice leading distance between two voicings
export function voiceLeadingDistance(v1: Voicing, v2: Voicing): number {
  const allNotes1 = [...v1.lhNotes, ...v1.rhNotes].map(n => n.midi);
  const allNotes2 = [...v2.lhNotes, ...v2.rhNotes].map(n => n.midi);

  // Simple sum of minimum distances for each note
  let totalDistance = 0;

  for (const midi1 of allNotes1) {
    let minDist = Infinity;
    for (const midi2 of allNotes2) {
      const dist = Math.abs(midi2 - midi1);
      if (dist < minDist) minDist = dist;
    }
    totalDistance += minDist === Infinity ? 12 : minDist;
  }

  return totalDistance;
}

// Get the best voicing for smooth voice leading
export function getBestVoicingForSmoothness(
  root: NoteName,
  chordType: ChordType,
  previousVoicing: Voicing | null,
  availableStyles: VoicingRecipe['style'][] = [],
  preferFlats: boolean = true
): Voicing {
  const recipes = getVoicingsForChord(chordType, availableStyles.length > 0 ? availableStyles : undefined);

  if (recipes.length === 0) {
    // Fallback to shell voicing
    const fallback = VOICING_RECIPES[chordType]?.[0] || {
      id: 'fallback',
      name: 'Fallback',
      style: 'shell' as const,
      lhIntervals: [4, 10],
      rhIntervals: [2],
      description: 'Fallback voicing'
    };
    return realizeVoicing(root, chordType, fallback, preferFlats);
  }

  if (!previousVoicing) {
    // No previous voicing, pick first recipe
    return realizeVoicing(root, chordType, recipes[0], preferFlats);
  }

  // Find the voicing with smallest voice leading distance
  let bestVoicing: Voicing | null = null;
  let bestDistance = Infinity;

  // Try different anchor points for more options
  const lhAnchors = [45, 48, 51]; // A2, C3, Eb3
  const rhAnchors = [64, 67, 70]; // E4, G4, Bb4

  for (const recipe of recipes) {
    for (const lhAnchor of lhAnchors) {
      for (const rhAnchor of rhAnchors) {
        const voicing = realizeVoicing(root, chordType, recipe, preferFlats, lhAnchor, rhAnchor);
        const distance = voiceLeadingDistance(previousVoicing, voicing);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestVoicing = voicing;
        }
      }
    }
  }

  return bestVoicing || realizeVoicing(root, chordType, recipes[0], preferFlats);
}

// Get a random voicing
export function getRandomVoicing(
  root: NoteName,
  chordType: ChordType,
  availableStyles: VoicingRecipe['style'][] = [],
  preferFlats: boolean = true
): Voicing {
  const recipes = getVoicingsForChord(chordType, availableStyles.length > 0 ? availableStyles : undefined);

  if (recipes.length === 0) {
    const fallback = VOICING_RECIPES[chordType]?.[0];
    if (fallback) {
      return realizeVoicing(root, chordType, fallback, preferFlats);
    }
    throw new Error(`No voicing recipes found for chord type: ${chordType}`);
  }

  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  const lhAnchor = 45 + Math.floor(Math.random() * 9); // Random LH anchor
  const rhAnchor = 64 + Math.floor(Math.random() * 9); // Random RH anchor

  return realizeVoicing(root, chordType, randomRecipe, preferFlats, lhAnchor, rhAnchor);
}

// Generate voicings for a full progression
export function generateProgressionVoicings(
  chords: { root: NoteName; type: ChordType }[],
  smooth: boolean = true,
  styles: VoicingRecipe['style'][] = [],
  preferFlats: boolean = true
): Voicing[] {
  const voicings: Voicing[] = [];

  for (let i = 0; i < chords.length; i++) {
    const { root, type } = chords[i];
    const previousVoicing = i > 0 ? voicings[i - 1] : null;

    let voicing: Voicing;
    if (smooth) {
      voicing = getBestVoicingForSmoothness(root, type, previousVoicing, styles, preferFlats);
    } else {
      voicing = getRandomVoicing(root, type, styles, preferFlats);
    }

    voicings.push(voicing);
  }

  return voicings;
}

// Get all notes from a voicing for display
export function getAllVoicingNotes(voicing: Voicing): Note[] {
  return [...voicing.lhNotes, ...voicing.rhNotes].sort((a, b) => a.midi - b.midi);
}

// Format notes for display
export function formatNotes(notes: Note[]): string {
  return notes.map(n => `${n.name}${n.octave}`).join(' ');
}
