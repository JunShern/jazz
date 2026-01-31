// Preact + HTM setup
const { h, render } = preact;
const { useState, useEffect, useMemo } = preactHooks;
const html = htm.bind(h);

// ============ COMPONENTS ============

function Keyboard({ lhNotes, rhNotes }) {
  const lhMidis = new Set(lhNotes.map(n => n.midi));
  const rhMidis = new Set(rhNotes.map(n => n.midi));

  const whiteKeyPositions = [0, 2, 4, 5, 7, 9, 11];
  const blackKeyOffsets = { 1: 0.6, 3: 1.8, 6: 3.6, 8: 4.7, 10: 5.8 };

  const keys = [];
  const startOctave = 2, endOctave = 5;

  for (let oct = startOctave; oct <= endOctave; oct++) {
    const baseMidi = (oct + 1) * 12;
    whiteKeyPositions.forEach((semitone, i) => {
      const midi = baseMidi + semitone;
      const isLH = lhMidis.has(midi);
      const isRH = rhMidis.has(midi);
      const keyIdx = (oct - startOctave) * 7 + i;
      const width = 100 / ((endOctave - startOctave + 1) * 7);
      keys.push(html`
        <div class="white-key ${isLH ? 'lh' : ''} ${isRH ? 'rh' : ''}"
             style="left: ${keyIdx * width}%; width: ${width}%"></div>
      `);
    });

    Object.entries(blackKeyOffsets).forEach(([semitone, offset]) => {
      const midi = baseMidi + parseInt(semitone);
      const isLH = lhMidis.has(midi);
      const isRH = rhMidis.has(midi);
      const pos = ((oct - startOctave) * 7 + offset) * (100 / ((endOctave - startOctave + 1) * 7));
      keys.push(html`
        <div class="black-key ${isLH ? 'lh' : ''} ${isRH ? 'rh' : ''}"
             style="left: ${pos}%; width: 3%"></div>
      `);
    });
  }

  return html`
    <div class="keyboard">
      <div class="keyboard-container">${keys}</div>
      <div class="keyboard-legend">
        <span class="legend-item legend-lh">LH</span>
        <span class="legend-item legend-rh">RH</span>
      </div>
    </div>
  `;
}

function ChordDisplay({ chord, voicing }) {
  if (!chord || !voicing) return null;

  const formatNote = n => `${n.name}${n.octave}`;
  const getDegree = interval => DEGREE_NAMES[interval % 12] || interval;

  return html`
    <div class="chord-display">
      <div class="chord-symbol">${formatChord(chord.root, chord.type)}</div>
      <div class="chord-name">${CHORD_TYPES[chord.type]?.name}</div>
      <div class="voicing-name">${voicing.name}</div>

      <div class="notes-section">
        <div class="hand-notes lh">
          <h3>Left Hand</h3>
          <div class="note-list">
            ${voicing.lhNotes.map((n, i) => html`
              <div class="note-item">
                <span>${formatNote(n)}</span>
                <span>${getDegree(voicing.lh[i])}</span>
              </div>
            `)}
          </div>
        </div>
        ${voicing.rhNotes.length > 0 && html`
          <div class="hand-notes rh">
            <h3>Right Hand</h3>
            <div class="note-list">
              ${voicing.rhNotes.map((n, i) => html`
                <div class="note-item">
                  <span>${formatNote(n)}</span>
                  <span>${getDegree(voicing.rh[i])}</span>
                </div>
              `)}
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

// ============ PAGES ============

function PracticePage() {
  const [key, setKey] = useState('C');
  const [progId, setProgId] = useState('ii-V-I');
  const [activeIdx, setActiveIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const progression = PROGRESSIONS.find(p => p.id === progId) || PROGRESSIONS[0];

  const chords = useMemo(() => {
    return progression.chords.map(([degree, type]) => {
      const root = getDegreeRoot(key, degree);
      return { root, type, degree };
    });
  }, [key, progression]);

  const currentChord = chords[activeIdx];
  const voicing = currentChord ? realizeVoicing(currentChord.root, currentChord.type, 0) : null;

  const goNext = () => setActiveIdx(i => (i + 1) % chords.length);
  const goPrev = () => setActiveIdx(i => (i - 1 + chords.length) % chords.length);

  return html`
    <div class="header">
      <h1>Key: ${key} | ${progression.name}</h1>
      <button class="ctrl-btn" onClick=${() => setShowSettings(!showSettings)}>⚙️</button>
    </div>

    ${showSettings && html`
      <div class="settings">
        <div class="settings-grid">
          <div class="setting-group">
            <label>Key</label>
            <select value=${key} onChange=${e => { setKey(e.target.value); setActiveIdx(0); }}>
              ${NOTE_NAMES.map(n => html`<option value=${n}>${n}</option>`)}
            </select>
          </div>
          <div class="setting-group">
            <label>Progression</label>
            <select value=${progId} onChange=${e => { setProgId(e.target.value); setActiveIdx(0); }}>
              ${PROGRESSIONS.map(p => html`<option value=${p.id}>${p.name}</option>`)}
            </select>
          </div>
        </div>
      </div>
    `}

    <div class="page">
      <${ChordDisplay} chord=${currentChord} voicing=${voicing} />
      ${voicing && html`<${Keyboard} lhNotes=${voicing.lhNotes} rhNotes=${voicing.rhNotes} />`}

      <div style="text-align: center; margin-top: 16px; color: var(--text-muted)">
        Bar ${activeIdx + 1} of ${chords.length}
      </div>
    </div>

    <div class="controls">
      <button class="nav-btn-lg" onClick=${goPrev}>◀ Prev</button>
      <button class="nav-btn-lg" onClick=${goNext}>Next ▶</button>
    </div>
  `;
}

function ReferencePage() {
  const [key, setKey] = useState('C');
  const [chordType, setChordType] = useState('maj7');
  const [voicingIdx, setVoicingIdx] = useState(0);

  const voicings = VOICINGS[chordType] || [];
  const voicing = realizeVoicing(key, chordType, voicingIdx);

  const getDegree = interval => DEGREE_NAMES[interval % 12] || interval;

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
          <${Keyboard} lhNotes=${voicing.lhNotes} rhNotes=${voicing.rhNotes} />
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
