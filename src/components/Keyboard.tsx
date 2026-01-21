// Piano keyboard visualization component

import { Note } from '../lib/music';
import './Keyboard.css';

interface KeyboardProps {
  lhNotes: Note[];
  rhNotes: Note[];
  startOctave?: number;
  endOctave?: number;
  showLabels?: boolean;
}

// White key positions (C, D, E, F, G, A, B)
const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [1, 3, 6, 8, 10];

// Black key offsets relative to white key
const BLACK_KEY_OFFSETS: Record<number, number> = {
  1: 0.6,  // C#
  3: 1.8,  // D#
  6: 3.6,  // F#
  8: 4.7,  // G#
  10: 5.8  // A#
};

export function Keyboard({
  lhNotes,
  rhNotes,
  startOctave = 2,
  endOctave = 5,
  showLabels = true
}: KeyboardProps) {
  const lhMidis = new Set(lhNotes.map(n => n.midi));
  const rhMidis = new Set(rhNotes.map(n => n.midi));

  // Generate all keys
  const whiteKeys: { midi: number; note: string; octave: number }[] = [];
  const blackKeys: { midi: number; note: string; octave: number; offset: number }[] = [];

  for (let octave = startOctave; octave <= endOctave; octave++) {
    const baseMidi = (octave + 1) * 12;

    WHITE_KEYS.forEach(semitone => {
      const midi = baseMidi + semitone;
      const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
      const noteName = noteNames[WHITE_KEYS.indexOf(semitone)];
      whiteKeys.push({ midi, note: noteName, octave });
    });

    BLACK_KEYS.forEach(semitone => {
      const midi = baseMidi + semitone;
      const noteNames = ['C#', 'D#', '', 'F#', 'G#', 'A#'];
      const noteIndex = [1, 3, -1, 6, 8, 10].indexOf(semitone);
      const noteName = noteNames[noteIndex >= 0 ? noteIndex : 0];
      const offset = BLACK_KEY_OFFSETS[semitone];
      blackKeys.push({ midi, note: noteName, octave, offset });
    });
  }

  const whiteKeyWidth = 100 / whiteKeys.length;

  return (
    <div className="keyboard">
      <div className="keyboard-container">
        {/* White keys */}
        {whiteKeys.map((key, index) => {
          const isLH = lhMidis.has(key.midi);
          const isRH = rhMidis.has(key.midi);
          const className = `white-key ${isLH ? 'lh-active' : ''} ${isRH ? 'rh-active' : ''}`;

          return (
            <div
              key={key.midi}
              className={className}
              style={{ left: `${index * whiteKeyWidth}%`, width: `${whiteKeyWidth}%` }}
            >
              {showLabels && (isLH || isRH) && (
                <span className="key-label">
                  {key.note}{key.octave}
                </span>
              )}
            </div>
          );
        })}

        {/* Black keys */}
        {blackKeys.map(key => {
          const isLH = lhMidis.has(key.midi);
          const isRH = rhMidis.has(key.midi);
          const className = `black-key ${isLH ? 'lh-active' : ''} ${isRH ? 'rh-active' : ''}`;

          // Calculate position based on octave and offset
          const octaveIndex = key.octave - startOctave;
          const whiteKeysPerOctave = 7;
          const position = (octaveIndex * whiteKeysPerOctave + key.offset) * whiteKeyWidth;

          return (
            <div
              key={key.midi}
              className={className}
              style={{ left: `${position}%` }}
            >
              {showLabels && (isLH || isRH) && (
                <span className="key-label">
                  {key.note}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="keyboard-legend">
        <span className="legend-item lh-legend">LH</span>
        <span className="legend-item rh-legend">RH</span>
      </div>
    </div>
  );
}
