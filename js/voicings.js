// Voicing recipes
const VOICINGS = {
  'maj7': [
    { name: 'Shell (3-7)', lh: [4, 11], rh: [2, 7] },
    { name: 'Rootless A', lh: [4, 7, 11, 14], rh: [] },
    { name: 'Full', lh: [0, 7], rh: [4, 11, 14] }
  ],
  '6': [
    { name: 'Shell (3-6)', lh: [4, 9], rh: [2, 7] },
    { name: 'Full', lh: [0, 7], rh: [4, 9, 14] }
  ],
  'm7': [
    { name: 'Shell (b3-b7)', lh: [3, 10], rh: [2, 7] },
    { name: 'Rootless A', lh: [3, 7, 10, 14], rh: [] },
    { name: 'Full', lh: [0, 7], rh: [3, 10, 14] }
  ],
  'm6': [
    { name: 'Shell (b3-6)', lh: [3, 9], rh: [2, 7] },
    { name: 'Full', lh: [0, 7], rh: [3, 9, 14] }
  ],
  '7': [
    { name: 'Shell (3-b7)', lh: [4, 10], rh: [2, 9] },
    { name: 'Rootless A', lh: [4, 9, 10, 14], rh: [] },
    { name: 'Full', lh: [0, 7], rh: [4, 10, 14] }
  ],
  '7b9': [
    { name: 'Shell (3-b7-b9)', lh: [4, 10], rh: [1, 8] },
    { name: 'Full', lh: [0], rh: [4, 10, 13, 20] }
  ],
  '7alt': [
    { name: 'Shell (3-b7)', lh: [4, 10], rh: [1, 8] },
    { name: 'Full', lh: [0], rh: [4, 8, 10, 13] }
  ],
  'm7b5': [
    { name: 'Shell (b3-b7)', lh: [3, 10], rh: [6, 14] },
    { name: 'Full', lh: [0, 6], rh: [3, 10, 14] }
  ],
  'dim7': [
    { name: 'Shell', lh: [3, 9], rh: [6, 0] },
    { name: 'Full', lh: [0, 6], rh: [3, 9] }
  ],
  '7sus': [
    { name: 'Shell (4-b7)', lh: [5, 10], rh: [2, 7] },
    { name: 'Quartal', lh: [10, 14, 19], rh: [5, 12] }
  ]
};

function realizeVoicing(root, chordType, voicingIdx) {
  const voicing = VOICINGS[chordType]?.[voicingIdx] || VOICINGS[chordType]?.[0];
  if (!voicing) return null;

  const rootMidi = 48 + getNoteIndex(root); // C3 base

  const lhNotes = voicing.lh.map(interval => {
    let midi = rootMidi + interval;
    while (midi < 36) midi += 12; // C2 minimum
    while (midi > 55) midi -= 12; // G3 maximum
    return midiToNote(midi);
  });

  const rhNotes = voicing.rh.map(interval => {
    let midi = rootMidi + 12 + interval; // One octave up
    while (midi < 55) midi += 12; // G3 minimum
    while (midi > 95) midi -= 12; // B6 maximum
    return midiToNote(midi);
  });

  return { name: voicing.name, lh: voicing.lh, rh: voicing.rh, lhNotes, rhNotes };
}
