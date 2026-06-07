export default function RoadmapTimeline({ weeks = [] }) {
  return <div className="timeline">{weeks.map((week) => <article className="timeline-item glass" key={week.week}><span>Week {week.week}</span><h3>{week.title}</h3><p><b>Topics:</b> {(week.topics || []).join(', ')}</p><p><b>Resources:</b> {(week.resources || []).join(', ')}</p><p><b>Practice:</b> {(week.practiceTasks || []).join(', ')}</p><p><b>Projects:</b> {(week.projects || []).join(', ')}</p></article>)}</div>;
}
