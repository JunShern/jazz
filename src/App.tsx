import { useState } from 'react'
import './App.css'

// Minimal app to test deployment
function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '40px',
      background: '#1a1a2e',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: '#4ecdc4' }}>Jazz Voicing Practice</h1>
      <p>If you can see this, the app is working!</p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          background: '#4ecdc4',
          color: '#1a1a2e',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Clicked {count} times
      </button>
    </div>
  )
}

export default App
