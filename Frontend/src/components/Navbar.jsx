import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.js';

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  return (
    <header className="nav glass">
      <Link to="/" className="brand"><span className="brand-mark">RF</span>ResumeFit</Link>
      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/analysis">Analyze</NavLink>
        <NavLink to="/roadmap">Roadmap</NavLink>
      </nav>
      <div className="nav-actions">
        {user ? <><span className="muted hide-mobile">{user.email}</span><button className="btn ghost" onClick={handleLogout}>Logout</button></> : <Link className="btn primary" to="/login">Login</Link>}
      </div>
    </header>
  );
}
