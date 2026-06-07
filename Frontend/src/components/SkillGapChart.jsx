export default function SkillGapChart({ current = [], required = [], missing = [] }) {
  return <div className="glass split-card"><div><h3>Current Skills</h3>{current.map((skill) => <span className="pill success" key={skill}>{skill}</span>)}</div><div><h3>Required Skills</h3>{required.map((skill) => <span className={`pill ${missing.includes(skill) ? 'danger' : 'success'}`} key={skill}>{skill}</span>)}</div><div><h3>Missing Priority</h3>{missing.map((skill) => <span className="pill warning" key={skill}>{skill}</span>)}</div></div>;
}
