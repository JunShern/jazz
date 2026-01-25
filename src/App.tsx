// Main App component with routing

import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Practice } from './pages/Practice';
import { ChordReference } from './pages/ChordReference';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="app">
        {/* Bottom navigation */}
        <nav className="app-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">🎹</span>
            <span className="nav-label">Practice</span>
          </NavLink>
          <NavLink to="/reference" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="nav-icon">📖</span>
            <span className="nav-label">Reference</span>
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Practice />} />
          <Route path="/reference" element={<ChordReference />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
