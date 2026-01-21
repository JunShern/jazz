// Chord detail display component

import { Voicing, ChordType } from '../lib/music';
import { CHORD_DEFINITIONS, getDegreeName } from '../lib/chords';
import './ChordDisplay.css';

interface ChordDisplayProps {
  chord: {
    root: string;
    type: ChordType;
    symbol: string;
  };
  voicing: Voicing | null;
  hideNotes?: boolean;
  onReveal?: () => void;
}

export function ChordDisplay({
  chord,
  voicing,
  hideNotes = false,
  onReveal
}: ChordDisplayProps) {
  const definition = CHORD_DEFINITIONS[chord.type];

  if (!voicing) {
    return (
      <div className="chord-display">
        <div className="chord-header">
          <h2 className="chord-symbol">{chord.symbol}</h2>
        </div>
        <p className="no-voicing">No voicing available</p>
      </div>
    );
  }

  const formatNote = (note: { name: string; octave: number }) => `${note.name}${note.octave}`;

  return (
    <div className="chord-display">
      {/* Main chord symbol */}
      <div className="chord-header">
        <h2 className="chord-symbol">{chord.symbol}</h2>
        <span className="chord-name">{definition?.name}</span>
      </div>

      {/* Voicing name */}
      <div className="voicing-info">
        <span className="voicing-name">{voicing.recipe.name}</span>
        <span className="voicing-style">{voicing.recipe.style}</span>
      </div>

      {/* Notes display */}
      <div className={`notes-section ${hideNotes ? 'hidden' : ''}`}>
        {hideNotes ? (
          <button className="reveal-btn" onClick={onReveal}>
            Reveal Notes
          </button>
        ) : (
          <>
            {/* Left hand notes */}
            <div className="hand-notes lh">
              <h3>Left Hand</h3>
              <div className="notes-list">
                {voicing.lhNotes.map((note, i) => (
                  <div key={i} className="note-item">
                    <span className="note-name">{formatNote(note)}</span>
                    <span className="note-degree">
                      {getDegreeName(voicing.recipe.lhIntervals[i], chord.type)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right hand notes */}
            {voicing.rhNotes.length > 0 && (
              <div className="hand-notes rh">
                <h3>Right Hand</h3>
                <div className="notes-list">
                  {voicing.rhNotes.map((note, i) => (
                    <div key={i} className="note-item">
                      <span className="note-name">{formatNote(note)}</span>
                      <span className="note-degree">
                        {getDegreeName(voicing.recipe.rhIntervals[i], chord.type)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chord tones reference */}
      <div className="chord-tones">
        <h4>Chord Tones</h4>
        <div className="intervals">
          {definition?.intervals.slice(0, 4).map((interval, i) => (
            <span key={i} className="interval">
              {getDegreeName(interval, chord.type)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
