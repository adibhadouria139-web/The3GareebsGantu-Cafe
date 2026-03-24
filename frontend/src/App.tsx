import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { TraderAnalyzerPage } from './pages/TraderAnalyzerPage';

function HomePage() {
  return (
    <section className="panel">
      <h1>Trading Workspace</h1>
      <p>
        The primary workflow is now the <strong>Trader Analyzer</strong>. Use the top navigation or jump directly
        into analysis to upload a chart and receive a structured setup breakdown.
      </p>
      <NavLink to="/trader-analyzer" className="btn btn-primary">
        Open Trader Analyzer
      </NavLink>
    </section>
  );
}

export function App() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <div>
          <p className="eyebrow">The3GareebsGantu</p>
          <p className="brand">Trader Desk</p>
        </div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink
            to="/trader-analyzer"
            className={({ isActive }) => (isActive ? 'nav-link active nav-link-primary' : 'nav-link nav-link-primary')}
          >
            Trader Analyzer
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trader-analyzer" element={<TraderAnalyzerPage />} />
          <Route path="*" element={<Navigate to="/trader-analyzer" replace />} />
        </Routes>
      </main>
    </div>
  );
}
