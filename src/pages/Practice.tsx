// Practice page - main drill interface

import { useState, useEffect, useCallback, useRef } from 'react';
import { NoteName, NOTE_NAMES_FLAT, Voicing, VoicingRecipe } from '../lib/music';
import { RealizedChord, PROGRESSION_TEMPLATES, realizeProgression, extendProgression } from '../lib/progressions';
import { generateProgressionVoicings } from '../lib/voicingEngine';
import { useSettings, AppSettings, useStats } from '../hooks/useLocalStorage';
import { Keyboard } from '../components/Keyboard';
import { PianoRoll } from '../components/PianoRoll';
import { ChordDisplay } from '../components/ChordDisplay';
import './Practice.css';

const ALL_KEYS = NOTE_NAMES_FLAT;
const BAR_OPTIONS = [3, 4, 6, 8, 12];

export function Practice() {
  const [settings, setSettings] = useSettings();
  const { stats, recordSession } = useStats();

  const [chords, setChords] = useState<RealizedChord[]>([]);
  const [voicings, setVoicings] = useState<Voicing[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [hideNotes, setHideNotes] = useState(settings.hideNotes);
  const [showSettings, setShowSettings] = useState(false);

  const sessionStartRef = useRef<number | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get voicing styles based on settings
  const getVoicingStyles = useCallback((s: AppSettings): VoicingRecipe['style'][] => {
    if (s.style === 'solo') {
      return ['full'];
    }
    return s.voicingStyles as VoicingRecipe['style'][];
  }, []);

  // Generate new drill
  const generateDrill = useCallback((newSettings?: Partial<AppSettings>) => {
    const s = { ...settings, ...newSettings };

    // Get key (random if enabled)
    let key = s.key as NoteName;
    if (s.randomKeyPerLoop) {
      const randomIndex = Math.floor(Math.random() * ALL_KEYS.length);
      key = ALL_KEYS[randomIndex];
    }

    // Get progression template
    const template = PROGRESSION_TEMPLATES.find(p => p.id === s.progressionId) || PROGRESSION_TEMPLATES[0];

    // Realize and extend progression
    const realized = realizeProgression(template, key, s.preferFlats);
    const extended = extendProgression(realized, s.bars);

    // Generate voicings
    const styles = getVoicingStyles(s);
    const newVoicings = generateProgressionVoicings(
      extended.map(c => ({ root: c.root, type: c.type })),
      s.smooth,
      styles,
      s.preferFlats
    );

    setChords(extended);
    setVoicings(newVoicings);
    setActiveIndex(0);

    // Start session tracking
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
    }
  }, [settings, getVoicingStyles]);

  // Initialize on mount
  useEffect(() => {
    generateDrill();
    return () => {
      // Record session duration on unmount
      if (sessionStartRef.current) {
        const duration = Math.floor((Date.now() - sessionStartRef.current) / 60000);
        if (duration > 0) {
          recordSession(duration);
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance logic
  useEffect(() => {
    if (isPlaying && settings.autoAdvance) {
      const interval = 60000 / settings.autoAdvanceTempo; // ms per beat
      autoAdvanceRef.current = setInterval(() => {
        setActiveIndex(prev => {
          const next = prev + 1;
          if (next >= chords.length) {
            if (loop) {
              if (settings.randomKeyPerLoop) {
                generateDrill();
              }
              return 0;
            }
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, interval);
    }

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [isPlaying, settings.autoAdvance, settings.autoAdvanceTempo, settings.randomKeyPerLoop, chords.length, loop, generateDrill]);

  // Navigation
  const goNext = () => {
    setActiveIndex(prev => {
      const next = prev + 1;
      if (next >= chords.length) {
        if (loop) {
          if (settings.randomKeyPerLoop) {
            generateDrill();
          }
          return 0;
        }
        return prev;
      }
      return next;
    });
  };

  const goPrev = () => {
    setActiveIndex(prev => {
      if (prev <= 0) {
        return loop ? chords.length - 1 : 0;
      }
      return prev - 1;
    });
  };

  // Update setting
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Regenerate if relevant setting changed
    if (['key', 'progressionId', 'bars', 'style', 'voicingStyles', 'smooth', 'preferFlats'].includes(key)) {
      generateDrill(newSettings);
    }
  };

  const currentChord = chords[activeIndex];
  const currentVoicing = voicings[activeIndex];
  const currentTemplate = PROGRESSION_TEMPLATES.find(p => p.id === settings.progressionId);

  return (
    <div className="practice-page">
      {/* Header */}
      <header className="practice-header">
        <div className="header-info">
          <span className="key-display">Key: {settings.key}</span>
          <span className="progression-name">{currentTemplate?.shortName}</span>
        </div>
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Toggle settings"
        >
          ⚙
        </button>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-grid">
            {/* Key selector */}
            <div className="setting-group">
              <label>Key</label>
              <select
                value={settings.key}
                onChange={e => updateSetting('key', e.target.value)}
              >
                {ALL_KEYS.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Progression selector */}
            <div className="setting-group">
              <label>Progression</label>
              <select
                value={settings.progressionId}
                onChange={e => updateSetting('progressionId', e.target.value)}
              >
                {PROGRESSION_TEMPLATES.map(p => (
                  <option key={p.id} value={p.id}>{p.shortName}</option>
                ))}
              </select>
            </div>

            {/* Bars selector */}
            <div className="setting-group">
              <label>Bars</label>
              <select
                value={settings.bars}
                onChange={e => updateSetting('bars', parseInt(e.target.value))}
              >
                {BAR_OPTIONS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Style selector */}
            <div className="setting-group">
              <label>Style</label>
              <select
                value={settings.style}
                onChange={e => updateSetting('style', e.target.value as 'accompaniment' | 'solo')}
              >
                <option value="accompaniment">Accompaniment</option>
                <option value="solo">Solo (with root)</option>
              </select>
            </div>

            {/* Voice leading toggle */}
            <div className="setting-group">
              <label>Voice Leading</label>
              <div className="toggle-buttons">
                <button
                  className={settings.smooth ? 'active' : ''}
                  onClick={() => updateSetting('smooth', true)}
                >
                  Smooth
                </button>
                <button
                  className={!settings.smooth ? 'active' : ''}
                  onClick={() => updateSetting('smooth', false)}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Auto-advance */}
            <div className="setting-group">
              <label>Auto-advance</label>
              <div className="auto-advance-control">
                <input
                  type="checkbox"
                  checked={settings.autoAdvance}
                  onChange={e => updateSetting('autoAdvance', e.target.checked)}
                />
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={settings.autoAdvanceTempo}
                  onChange={e => updateSetting('autoAdvanceTempo', parseInt(e.target.value))}
                  disabled={!settings.autoAdvance}
                />
                <span>{settings.autoAdvanceTempo} BPM</span>
              </div>
            </div>

            {/* Random key per loop */}
            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.randomKeyPerLoop}
                  onChange={e => updateSetting('randomKeyPerLoop', e.target.checked)}
                />
                Random key each loop
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="practice-main">
        {/* Chord display */}
        {currentChord && (
          <ChordDisplay
            chord={currentChord}
            voicing={currentVoicing}
            hideNotes={hideNotes}
            onReveal={() => setHideNotes(false)}
          />
        )}

        {/* Keyboard visualization */}
        <div className="visualization">
          {currentVoicing && (
            <Keyboard
              lhNotes={currentVoicing.lhNotes}
              rhNotes={currentVoicing.rhNotes}
              showLabels={!hideNotes}
            />
          )}
        </div>

        {/* Piano roll */}
        <PianoRoll
          chords={chords}
          voicings={voicings}
          activeIndex={activeIndex}
          onChordClick={setActiveIndex}
        />
      </main>

      {/* Navigation controls */}
      <nav className="practice-nav">
        <button className="nav-btn" onClick={goPrev} aria-label="Previous">
          ◀ Prev
        </button>

        <div className="nav-center">
          <button
            className={`loop-btn ${loop ? 'active' : ''}`}
            onClick={() => setLoop(!loop)}
            aria-label="Toggle loop"
          >
            🔁
          </button>

          {settings.autoAdvance && (
            <button
              className={`play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          )}

          <button
            className={`hide-btn ${hideNotes ? 'active' : ''}`}
            onClick={() => setHideNotes(!hideNotes)}
            aria-label="Toggle hide notes"
          >
            {hideNotes ? '👁' : '🙈'}
          </button>
        </div>

        <button className="nav-btn" onClick={goNext} aria-label="Next">
          Next ▶
        </button>
      </nav>

      {/* New drill button */}
      <div className="new-drill">
        <button onClick={() => generateDrill()}>
          New Drill
        </button>
      </div>

      {/* Stats display */}
      <div className="stats-bar">
        <span>Today: {stats.sessionsToday} sessions</span>
        <span>Week: {stats.minutesThisWeek} min</span>
      </div>
    </div>
  );
}
