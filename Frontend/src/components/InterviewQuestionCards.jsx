const categories = ['technical', 'behavioral', 'scenario', 'hr'];

export default function InterviewQuestionCards({ questions = [] }) {
  return (
    <div className="stack">
      {categories.map((category) => {
        const categoryQuestions = questions.filter((question) => question.category === category);
        return (
          <section className="glass" key={category}>
            <h2>{category} Questions</h2>
            <div className="question-grid">
              {categoryQuestions.length ? categoryQuestions.map((question) => (
                <article className="question-card" key={question.question}>
                  <span className={`pill ${question.difficulty === 'hard' ? 'danger' : question.difficulty === 'medium' ? 'warning' : 'success'}`}>{question.difficulty}</span>
                  <h3>{question.question}</h3>
                  <p>{question.answerStrategy}</p>
                  {(question.technologies || []).map((technology) => <span className="keyword found" key={technology}>{technology}</span>)}
                </article>
              )) : <p className="muted">No {category} questions generated yet.</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
