# Jazz Voicing Practice

A mobile-first web app for practicing jazz piano voicings. Designed for quick 5-15 minute practice sessions.

## Features

### Practice Mode
- **Progression-based drills**: ii-V-I (major/minor), turnarounds, backdoor, sus cadences, and more
- **Smart voice leading**: Smooth option minimizes hand movement between chords
- **Multiple voicing styles**: Shells, Rootless A/B, Quartal, Full voicings
- **Visual feedback**: Piano keyboard and piano roll visualization
- **Hide/Reveal mode**: Test yourself before seeing the notes
- **Auto-advance**: Set a tempo and practice in time
- **All 12 keys**: Practice in any key, or randomize each loop

### Chord Reference
- **Browse all chord types**: Major, Minor, Dominant, Diminished, Suspended
- **Key-aware**: See actual notes for any chord in any key
- **Voicing recipes**: Multiple voicing options for each chord type
- **Visual keyboard**: See exactly where to place your hands

## Tech Stack

- **Vite** + **React** + **TypeScript**
- No backend - runs entirely in the browser
- Settings and stats persisted in localStorage
- Dark mode, mobile-first responsive design

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

This app is configured for GitHub Pages deployment. Push to `main` to trigger automatic deployment via GitHub Actions.

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main branch

The app will be available at `https://<username>.github.io/jazz/`

## Supported Progressions

- **ii-V-I (Major)**: Dm7 → G7 → Cmaj7
- **ii-V-i (Minor)**: Dm7b5 → G7b9 → Cm7
- **I-vi-ii-V (Turnaround)**: Cmaj7 → Am7 → Dm7 → G7
- **iii-vi-ii-V**: Em7 → A7 → Dm7 → G7
- **Backdoor**: Fm7 → Bb7 → Cmaj7
- **Sus Cadence**: Dm7 → G9sus → Cmaj7
- **Rhythm Changes A**: Full 8-bar A section
- **Minor Blues**: First 4 bars
- **Altered ii-V-I**: With V7alt
- **Minor Line Cliche**: im7 → im(maj7) → im7 → im6

## Chord Types

- **Major**: maj7, 6
- **Minor**: m7, m6, m(maj7)
- **Dominant**: 7, 7b9, 7#9, 7#5, 7b13, 7alt
- **Diminished**: m7b5 (half-dim), dim7
- **Suspended**: 7sus4, 9sus4

## Voicing Styles

- **Shell/Guide Tones**: 3rd and 7th (or 3rd and 6th)
- **Rootless Type A**: Bill Evans style, 3-5-7-9
- **Rootless Type B**: Inverted, 7-9-3-5
- **Quartal**: Stacked 4ths, "So What" style
- **Full**: Includes root, for solo playing

## License

MIT
