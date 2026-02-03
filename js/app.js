// Preact + HTM setup
const { h, render } = preact;
const { useState, useEffect, useMemo } = preactHooks;
const html = htm.bind(h);

// ============ VOICING STYLES ============

const VOICING_STYLES = {
  shell: { name: 'Shell' },
  rootless: { name: 'Rootless' },
  solo: { name: 'Solo Piano' },
  full: { name: 'Full' }
};

// Map chord types to voicing index for each style
function getVoicingForStyle(chordType, style) {
  const voicings = VOICINGS[chordType];
  if (!voicings) return 0;

  const styleMap = {
    shell: ['Shell'],
    rootless: ['Rootless'],
    solo: ['Solo Piano'],
    full: ['Full']
  };

  const keywords = styleMap[style] || styleMap.shell;
  const idx = voicings.findIndex(v => keywords.some(k => v.name.includes(k)));
  return idx >= 0 ? idx : 0;
}

// ============ COMPONENTS ============

// Compact keyboard with interval labels
function CompactKeyboard({ lhNotes, rhNotes, lhIntervals, rhIntervals, chordRoot }) {
  const lhMidis = new Map(lhNotes.map((n, i) => [n.midi, lhIntervals[i]]));
  const rhMidis = new Map(rhNotes.map((n, i) => [n.midi, rhIntervals[i]]));

  const whiteKeyPositions = [0, 2, 4, 5, 7, 9, 11];
  const blackKeyOffsets = { 1: 0.65, 3: 1.75, 6: 3.65, 8: 4.7, 10: 5.75 };

  const keys = [];
  const labels = [];
  const startOctave = 2, endOctave = 6;
  const totalWhiteKeys = (endOctave - startOctave + 1) * 7;
  const keyWidth = 100 / totalWhiteKeys;

  for (let oct = startOctave; oct <= endOctave; oct++) {
    const baseMidi = (oct + 1) * 12;

    // White keys
    whiteKeyPositions.forEach((semitone, i) => {
      const midi = baseMidi + semitone;
      const isLH = lhMidis.has(midi);
      const isRH = rhMidis.has(midi);
      const keyIdx = (oct - startOctave) * 7 + i;
      const left = keyIdx * keyWidth;

      keys.push(html`
        <div class="white-key ${isLH ? 'lh' : ''} ${isRH ? 'rh' : ''}"
             style="left: ${left}%; width: ${keyWidth}%"></div>
      `);

      if (isLH || isRH) {
        const interval = isLH ? lhMidis.get(midi) : rhMidis.get(midi);
        const label = DEGREE_NAMES[interval % 12] || interval;
        labels.push(html`
          <div class="key-label ${isLH ? 'lh' : 'rh'}"
               style="left: ${left + keyWidth/2}%">${label}</div>
        `);
      }
    });

    // Black keys
    Object.entries(blackKeyOffsets).forEach(([semitone, offset]) => {
      const midi = baseMidi + parseInt(semitone);
      const isLH = lhMidis.has(midi);
      const isRH = rhMidis.has(midi);
      const pos = ((oct - startOctave) * 7 + offset) * keyWidth;

      keys.push(html`
        <div class="black-key ${isLH ? 'lh' : ''} ${isRH ? 'rh' : ''}"
             style="left: ${pos}%; width: ${keyWidth * 0.7}%"></div>
      `);

      if (isLH || isRH) {
        const interval = isLH ? lhMidis.get(midi) : rhMidis.get(midi);
        const label = DEGREE_NAMES[interval % 12] || interval;
        labels.push(html`
          <div class="key-label black ${isLH ? 'lh' : 'rh'}"
               style="left: ${pos + keyWidth * 0.35}%">${label}</div>
        `);
      }
    });
  }

  return html`
    <div class="compact-keyboard">
      <div class="keyboard-keys">${keys}</div>
      <div class="keyboard-labels">${labels}</div>
    </div>
  `;
}

// Single chord card with mini keyboard
function ChordCard({ chord, voicing, isActive }) {
  if (!chord || !voicing) return null;

  return html`
    <div class="chord-card ${isActive ? 'active' : ''}">
      <div class="chord-card-symbol">${formatChord(chord.root, chord.type)}</div>
      <div class="chord-card-voicing">${voicing.name}</div>
      <${CompactKeyboard}
        lhNotes=${voicing.lhNotes}
        rhNotes=${voicing.rhNotes}
        lhIntervals=${voicing.lh}
        rhIntervals=${voicing.rh}
        chordRoot=${chord.root}
      />
    </div>
  `;
}

// ============ PAGES ============

function PracticePage() {
  const [key, setKey] = useState(() => localStorage.getItem('jazz-key') || 'C');
  const [progId, setProgId] = useState(() => localStorage.getItem('jazz-prog') || 'ii-V-I');
  const [voicingStyle, setVoicingStyle] = useState(() => localStorage.getItem('jazz-style') || 'shell');

  // Persist settings
  useEffect(() => { localStorage.setItem('jazz-key', key); }, [key]);
  useEffect(() => { localStorage.setItem('jazz-prog', progId); }, [progId]);
  useEffect(() => { localStorage.setItem('jazz-style', voicingStyle); }, [voicingStyle]);

  const progression = PROGRESSIONS.find(p => p.id === progId) || PROGRESSIONS[0];

  const chordsWithVoicings = useMemo(() => {
    return progression.chords.map(([degree, type]) => {
      const root = getDegreeRoot(key, degree);
      const voicingIdx = getVoicingForStyle(type, voicingStyle);
      const voicing = realizeVoicing(root, type, voicingIdx);
      return { root, type, degree, voicing };
    });
  }, [key, progression, voicingStyle]);

  // Format chord sequence for display at top
  const chordSequence = chordsWithVoicings.map(c => formatChord(c.root, c.type)).join('  →  ');

  // Random new sequence
  const randomize = () => {
    const keys = NOTE_NAMES;
    const progs = PROGRESSIONS;
    setKey(keys[Math.floor(Math.random() * keys.length)]);
    setProgId(progs[Math.floor(Math.random() * progs.length)].id);
  };

  return html`
    <div class="header">
      <h1>Practice</h1>
    </div>

    <div class="settings-panel">
      <div class="settings-section">
        <div class="settings-section-label">Key</div>
        <div class="settings-chips">
          ${NOTE_NAMES.map(n => html`
            <button class="chip ${n === key ? 'active' : ''}" onClick=${() => setKey(n)}>${n}</button>
          `)}
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-label">Progression</div>
        <div class="settings-chips">
          ${PROGRESSIONS.map(p => html`
            <button class="chip chip-prog ${p.id === progId ? 'active' : ''}" onClick=${() => setProgId(p.id)}>${p.name}</button>
          `)}
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-label">Voicing</div>
        <div class="settings-chips">
          ${Object.entries(VOICING_STYLES).map(([id, s]) => html`
            <button class="chip chip-style ${id === voicingStyle ? 'active' : ''}" onClick=${() => setVoicingStyle(id)}>${s.name}</button>
          `)}
        </div>
      </div>

      <button class="randomize-btn" onClick=${randomize}>🎲 Random</button>
    </div>

    <div class="page">
      <div class="sequence-display">
        <div class="sequence-chords">${chordSequence}</div>
      </div>

      <div class="chord-cards">
        ${chordsWithVoicings.map((chord, i) => html`
          <${ChordCard}
            chord=${chord}
            voicing=${chord.voicing}
            isActive=${false}
          />
        `)}
      </div>

      <div class="legend-bar">
        <span class="legend-item legend-lh">Left Hand</span>
        <span class="legend-item legend-rh">Right Hand</span>
      </div>
    </div>
  `;
}

function ReferencePage() {
  const [key, setKey] = useState('C');
  const [chordType, setChordType] = useState('maj7');
  const [voicingIdx, setVoicingIdx] = useState(0);

  const voicings = VOICINGS[chordType] || [];
  const voicing = realizeVoicing(key, chordType, voicingIdx);
  const chordInfo = CHORD_TYPES[chordType];

  const getDegree = interval => DEGREE_NAMES[interval % 12] || interval;

  // Get full chord tones (notes + intervals)
  const chordTones = useMemo(() => {
    if (!chordInfo) return [];
    const rootIdx = NOTE_NAMES.indexOf(key);
    return chordInfo.intervals.map(interval => {
      const noteIdx = (rootIdx + interval) % 12;
      return {
        note: NOTE_NAMES[noteIdx],
        interval: getDegree(interval)
      };
    });
  }, [key, chordType, chordInfo]);

  return html`
    <div class="header">
      <h1>Chord Reference</h1>
    </div>

    <div class="page">
      <div class="key-selector">
        ${NOTE_NAMES.map(n => html`
          <button class="key-btn ${n === key ? 'active' : ''}" onClick=${() => setKey(n)}>${n}</button>
        `)}
      </div>

      <div class="chord-grid">
        ${Object.keys(CHORD_TYPES).map(type => html`
          <button class="chord-btn ${type === chordType ? 'active' : ''}"
                  onClick=${() => { setChordType(type); setVoicingIdx(0); }}>
            <div class="chord-btn-symbol">${formatChord(key, type)}</div>
            <div class="chord-btn-name">${CHORD_TYPES[type].name}</div>
          </button>
        `)}
      </div>

      <div class="chord-tones">
        <div class="chord-tones-header">${formatChord(key, chordType)} - Full Chord Tones</div>
        <div class="chord-tones-grid">
          ${chordTones.map(t => html`
            <div class="chord-tone">
              <div class="chord-tone-note">${t.note}</div>
              <div class="chord-tone-interval">${t.interval}</div>
            </div>
          `)}
        </div>
      </div>

      <h3 style="margin-bottom: 12px">Voicings</h3>
      <div class="voicing-list">
        ${voicings.map((v, i) => html`
          <button class="voicing-btn ${i === voicingIdx ? 'active' : ''}" onClick=${() => setVoicingIdx(i)}>
            <div class="voicing-btn-name">${v.name}</div>
            <div class="voicing-btn-intervals">
              <span class="lh">LH: ${v.lh.map(getDegree).join(' ')}</span>
              ${v.rh.length > 0 && html`<span class="rh"> | RH: ${v.rh.map(getDegree).join(' ')}</span>`}
            </div>
          </button>
        `)}
      </div>

      ${voicing && html`
        <div style="margin-top: 16px">
          <${CompactKeyboard}
            lhNotes=${voicing.lhNotes}
            rhNotes=${voicing.rhNotes}
            lhIntervals=${voicing.lh}
            rhIntervals=${voicing.rh}
          />
          <div class="legend-bar" style="margin-top: 8px">
            <span class="legend-item legend-lh">LH</span>
            <span class="legend-item legend-rh">RH</span>
          </div>
        </div>
      `}
    </div>
  `;
}

// ============ APP ============

function App() {
  const [page, setPage] = useState('practice');

  return html`
    ${page === 'practice' ? html`<${PracticePage} />` : html`<${ReferencePage} />`}

    <nav class="nav">
      <button class="nav-btn ${page === 'practice' ? 'active' : ''}" onClick=${() => setPage('practice')}>
        <span>🎹</span>
        <span>Practice</span>
      </button>
      <button class="nav-btn ${page === 'reference' ? 'active' : ''}" onClick=${() => setPage('reference')}>
        <span>📖</span>
        <span>Reference</span>
      </button>
    </nav>
  `;
}

// Mount
render(html`<${App} />`, document.getElementById('app'));
