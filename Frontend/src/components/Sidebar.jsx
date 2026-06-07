import { NavLink } from 'react-router-dom';
const links = [['/dashboard', 'Analytics'], ['/analysis', 'New Analysis'], ['/resume-improvement', 'Resume Engine'], ['/interview-prep', 'Interview Prep'], ['/roadmap', 'Roadmap']];
export default function Sidebar() {
  return <aside className="sidebar glass">{links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</aside>;
}
