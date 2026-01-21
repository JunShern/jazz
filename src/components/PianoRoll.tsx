// Piano roll visualization for the progression

import { Voicing } from '../lib/music';
import { RealizedChord } from '../lib/progressions';
import './PianoRoll.css';

interface PianoRollProps {
  chords: RealizedChord[];
  voicings: Voicing[];
  activeIndex: number;
  onChordClick?: (index: number) => void;
}

// MIDI range for the piano roll
const MIN_MIDI = 36; // C2
const MAX_MIDI = 84; // C6
const TOTAL_NOTES = MAX_MIDI - MIN_MIDI + 1;

export function PianoRoll({
  chords,
  voicings,
  activeIndex,
  onChordClick
}: PianoRollProps) {
  if (chords.length === 0) {
    return (
      <div className="piano-roll empty">
        <p>No progression loaded</p>
      </div>
    );
  }

  // Note height percentage
  const noteHeight = 100 / TOTAL_NOTES;

  return (
    <div className="piano-roll">
      {/* Piano key labels on the left */}
      <div className="roll-keys">
        {[2, 3, 4, 5].map(octave => (
          <div key={octave} className="octave-label">
            C{octave}
          </div>
        ))}
      </div>

      {/* Chord columns */}
      <div className="roll-grid">
        {chords.map((chord, index) => {
          const voicing = voicings[index];
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className={`roll-column ${isActive ? 'active' : ''}`}
              onClick={() => onChordClick?.(index)}
            >
              {/* Chord symbol header */}
              <div className="column-header">
                <span className="chord-symbol">{chord.symbol}</span>
              </div>

              {/* Note grid */}
              <div className="column-notes">
                {/* Grid lines for octaves */}
                {[0, 12, 24, 36, 48].map(offset => {
                  const midi = MIN_MIDI + offset;
                  if (midi > MAX_MIDI) return null;
                  const bottom = ((midi - MIN_MIDI) / TOTAL_NOTES) * 100;
                  return (
                    <div
                      key={offset}
                      className="grid-line"
                      style={{ bottom: `${bottom}%` }}
                    />
                  );
                })}

                {/* LH notes */}
                {voicing?.lhNotes.map((note, noteIndex) => {
                  if (note.midi < MIN_MIDI || note.midi > MAX_MIDI) return null;
                  const bottom = ((note.midi - MIN_MIDI) / TOTAL_NOTES) * 100;
                  return (
                    <div
                      key={`lh-${noteIndex}`}
                      className="roll-note lh"
                      style={{
                        bottom: `${bottom}%`,
                        height: `${noteHeight * 1.5}%`
                      }}
                      title={`${note.name}${note.octave}`}
                    />
                  );
                })}

                {/* RH notes */}
                {voicing?.rhNotes.map((note, noteIndex) => {
                  if (note.midi < MIN_MIDI || note.midi > MAX_MIDI) return null;
                  const bottom = ((note.midi - MIN_MIDI) / TOTAL_NOTES) * 100;
                  return (
                    <div
                      key={`rh-${noteIndex}`}
                      className="roll-note rh"
                      style={{
                        bottom: `${bottom}%`,
                        height: `${noteHeight * 1.5}%`
                      }}
                      title={`${note.name}${note.octave}`}
                    />
                  );
                })}
              </div>

              {/* Bar number */}
              <div className="column-footer">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
