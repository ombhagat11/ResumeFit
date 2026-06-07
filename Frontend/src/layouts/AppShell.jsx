import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
export default function AppShell({ children }) {
  return <div className="app-shell"><Navbar /><div className="shell-grid"><Sidebar /><main className="shell-main">{children}</main></div></div>;
}
