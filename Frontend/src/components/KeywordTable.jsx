export default function KeywordTable({ found = [], missing = [] }) {
  const rows = [...found.map((item) => ({ ...item, found: true })), ...missing.map((item) => ({ ...item, found: false }))];
  return <div className="glass table-card"><h3>ATS Keyword Analysis</h3><div className="keyword-grid">{rows.slice(0, 48).map((item, index) => <span className={`keyword ${item.found ? 'found' : 'missing'}`} key={`${item.keyword}-${index}`}>{item.keyword}</span>)}</div></div>;
}
