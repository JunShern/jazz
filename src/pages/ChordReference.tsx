// Chord Reference page - browse chords and voicings

import { useState, useMemo } from 'react';
import { NOTE_NAMES_FLAT, ChordType, formatChordSymbol, getNoteIndex } from '../lib/music';
import { CHORD_DEFINITIONS, CHORD_CATEGORIES, getDegreeName } from '../lib/chords';
import { VOICING_RECIPES, STYLE_NAMES, VoicingRecipe } from '../lib/voicings';
import { realizeVoicing } from '../lib/voicingEngine';
import { Keyboard } from '../components/Keyboard';
import './ChordReference.css';

type FlatNoteName = typeof NOTE_NAMES_FLAT[number];
const ALL_KEYS = NOTE_NAMES_FLAT;

export function ChordReference() {
  const [selectedKey, setSelectedKey] = useState<FlatNoteName>('C');
  const [selectedCategory, setSelectedCategory] = useState<string>('Major');
  const [selectedChordType, setSelectedChordType] = useState<ChordType>('maj7');
  const [selectedVoicingId, setSelectedVoicingId] = useState<string | null>(null);

  // Get chord types for current category
  const chordTypes = CHORD_CATEGORIES[selectedCategory as keyof typeof CHORD_CATEGORIES] || [];

  // Get voicings for current chord type
  const voicings = VOICING_RECIPES[selectedChordType] || [];

  // Realize selected voicing
  const realizedVoicing = useMemo(() => {
    if (!selectedVoicingId) return null;
    const recipe = voicings.find(v => v.id === selectedVoicingId);
    if (!recipe) return null;
    return realizeVoicing(selectedKey, selectedChordType, recipe, true);
  }, [selectedKey, selectedChordType, selectedVoicingId, voicings]);

  // Chord definition
  const chordDef = CHORD_DEFINITIONS[selectedChordType];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const types = CHORD_CATEGORIES[category as keyof typeof CHORD_CATEGORIES];
    if (types && types.length > 0) {
      setSelectedChordType(types[0]);
      setSelectedVoicingId(null);
    }
  };

  // Handle chord type change
  const handleChordTypeChange = (type: ChordType) => {
    setSelectedChordType(type);
    setSelectedVoicingId(null);
  };

  // Group voicings by style
  const voicingsByStyle = useMemo(() => {
    const grouped: Record<string, VoicingRecipe[]> = {};
    for (const v of voicings) {
      if (!grouped[v.style]) {
        grouped[v.style] = [];
      }
      grouped[v.style].push(v);
    }
    return grouped;
  }, [voicings]);

  return (
    <div className="chord-reference-page">
      {/* Header */}
      <header className="reference-header">
        <h1>Chord Reference</h1>
      </header>

      {/* Key selector */}
      <div className="key-selector">
        <label>Key:</label>
        <div className="key-buttons">
          {ALL_KEYS.map(k => (
            <button
              key={k}
              className={k === selectedKey ? 'active' : ''}
              onClick={() => setSelectedKey(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="category-tabs">
        {Object.keys(CHORD_CATEGORIES).map(cat => (
          <button
            key={cat}
            className={cat === selectedCategory ? 'active' : ''}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chord type selector */}
      <div className="chord-type-selector">
        {chordTypes.map(type => {
          const def = CHORD_DEFINITIONS[type];
          return (
            <button
              key={type}
              className={type === selectedChordType ? 'active' : ''}
              onClick={() => handleChordTypeChange(type)}
            >
              <span className="type-symbol">{formatChordSymbol(selectedKey, type)}</span>
              <span className="type-name">{def?.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main className="reference-main">
        {/* Chord info */}
        <section className="chord-info">
          <h2>{formatChordSymbol(selectedKey, selectedChordType)}</h2>
          <p className="chord-full-name">{chordDef?.name}</p>
          <p className="chord-description">{chordDef?.description}</p>

          {/* Chord tones */}
          <div className="chord-tones-section">
            <h3>Chord Tones</h3>
            <div className="chord-tones-grid">
              {chordDef?.intervals.map((interval, i) => {
                const noteIndex = (getNoteIndex(selectedKey) + interval) % 12;
                const noteName = NOTE_NAMES_FLAT[noteIndex];
                return (
                  <div key={i} className="tone-item">
                    <span className="tone-note">{noteName}</span>
                    <span className="tone-degree">{getDegreeName(interval, selectedChordType)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available tensions */}
          {chordDef?.tensions && chordDef.tensions.length > 0 && (
            <div className="tensions-section">
              <h3>Available Tensions</h3>
              <div className="tensions-list">
                {chordDef.tensions.map((interval, i) => {
                  const noteIndex = (getNoteIndex(selectedKey) + interval) % 12;
                  const noteName = NOTE_NAMES_FLAT[noteIndex];
                  return (
                    <span key={i} className="tension-item">
                      {noteName} ({getDegreeName(interval, selectedChordType)})
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Voicings list */}
        <section className="voicings-section">
          <h3>Voicing Recipes</h3>

          {Object.entries(voicingsByStyle).map(([style, recipes]) => (
            <div key={style} className="voicing-group">
              <h4>{STYLE_NAMES[style as keyof typeof STYLE_NAMES]}</h4>
              <div className="voicing-list">
                {recipes.map(recipe => (
                  <button
                    key={recipe.id}
                    className={`voicing-item ${selectedVoicingId === recipe.id ? 'active' : ''}`}
                    onClick={() => setSelectedVoicingId(
                      selectedVoicingId === recipe.id ? null : recipe.id
                    )}
                  >
                    <span className="voicing-name">{recipe.name}</span>
                    <span className="voicing-desc">{recipe.description}</span>
                    <div className="voicing-intervals">
                      <span className="lh-intervals">
                        LH: {recipe.lhIntervals.map(i => getDegreeName(i, selectedChordType)).join(' ')}
                      </span>
                      {recipe.rhIntervals.length > 0 && (
                        <span className="rh-intervals">
                          RH: {recipe.rhIntervals.map(i => getDegreeName(i, selectedChordType)).join(' ')}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Voicing visualization */}
        {realizedVoicing && (
          <section className="voicing-detail">
            <h3>Voicing: {realizedVoicing.recipe.name}</h3>

            {/* Keyboard */}
            <div className="voicing-keyboard">
              <Keyboard
                lhNotes={realizedVoicing.lhNotes}
                rhNotes={realizedVoicing.rhNotes}
                showLabels={true}
              />
            </div>

            {/* Notes breakdown */}
            <div className="notes-breakdown">
              <div className="hand-section lh">
                <h4>Left Hand</h4>
                <div className="notes-list">
                  {realizedVoicing.lhNotes.map((note, i) => (
                    <div key={i} className="note-detail">
                      <span className="note-name">{note.name}{note.octave}</span>
                      <span className="note-interval">
                        {getDegreeName(realizedVoicing.recipe.lhIntervals[i], selectedChordType)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {realizedVoicing.rhNotes.length > 0 && (
                <div className="hand-section rh">
                  <h4>Right Hand</h4>
                  <div className="notes-list">
                    {realizedVoicing.rhNotes.map((note, i) => (
                      <div key={i} className="note-detail">
                        <span className="note-name">{note.name}{note.octave}</span>
                        <span className="note-interval">
                          {getDegreeName(realizedVoicing.recipe.rhIntervals[i], selectedChordType)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
