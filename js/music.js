// Music theory constants
const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const CHORD_TYPES = {
  'maj7': { name: 'Major 7', intervals: [0, 4, 7, 11], symbol: 'maj7' },
  '6': { name: 'Major 6', intervals: [0, 4, 7, 9], symbol: '6' },
  'm7': { name: 'Minor 7', intervals: [0, 3, 7, 10], symbol: 'm7' },
  'm6': { name: 'Minor 6', intervals: [0, 3, 7, 9], symbol: 'm6' },
  '7': { name: 'Dominant 7', intervals: [0, 4, 7, 10], symbol: '7' },
  '7b9': { name: 'Dom 7 flat 9', intervals: [0, 4, 7, 10, 1], symbol: '7(b9)' },
  '7alt': { name: 'Altered Dom', intervals: [0, 4, 8, 10, 1], symbol: '7alt' },
  'm7b5': { name: 'Half-Dim', intervals: [0, 3, 6, 10], symbol: 'ø7' },
  'dim7': { name: 'Diminished', intervals: [0, 3, 6, 9], symbol: '°7' },
  '7sus': { name: 'Dom 7 sus', intervals: [0, 5, 7, 10], symbol: '7sus4' }
};

const PROGRESSIONS = [
  { id: 'ii-V-I', name: 'ii-V-I Major', chords: [[2, 'm7'], [5, '7'], [1, 'maj7']] },
  { id: 'ii-V-i', name: 'ii-V-i Minor', chords: [[2, 'm7b5'], [5, '7b9'], [1, 'm7']] },
  { id: 'I-vi-ii-V', name: 'Turnaround', chords: [[1, 'maj7'], [6, 'm7'], [2, 'm7'], [5, '7']] },
  { id: 'iii-vi-ii-V', name: 'iii-vi-ii-V', chords: [[3, 'm7'], [6, '7'], [2, 'm7'], [5, '7']] },
  { id: 'backdoor', name: 'Backdoor', chords: [[4, 'm7'], [7, '7'], [1, 'maj7']] }
];

const DEGREE_NAMES = { 0: 'R', 1: 'b9', 2: '9', 3: 'b3', 4: '3', 5: '11', 6: 'b5', 7: '5', 8: '#5', 9: '13', 10: 'b7', 11: '7' };

function getNoteIndex(name) {
  return NOTE_NAMES.indexOf(name);
}

function transposeNote(name, semitones) {
  const idx = getNoteIndex(name);
  return NOTE_NAMES[(idx + semitones + 12) % 12];
}

function getDegreeRoot(key, degree) {
  const majorScale = [0, 2, 4, 5, 7, 9, 11];
  const semitones = majorScale[(degree - 1) % 7];
  // Special handling for flat 7 (backdoor)
  return transposeNote(key, semitones);
}

function formatChord(root, type) {
  return root + CHORD_TYPES[type].symbol;
}

function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const noteIdx = midi % 12;
  return { name: NOTE_NAMES[noteIdx], octave, midi };
}
