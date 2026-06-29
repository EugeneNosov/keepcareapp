import { Link } from 'react-router'

export function TasksListPage() {
  return (
    <section className="tasks-page">
      <header className="tasks-page__header">
        <div>
          <p className="tasks-page__eyebrow">Workspace / Tasks</p>
          <h1>Tasks</h1>
          <p className="tasks-page__description">
            Keep track of everything that needs your attention.
          </p>
        </div>
        <span className="tasks-page__counter">01 active</span>
      </header>

      <div className="tasks-page__panel">
        <div>
          <span className="tasks-page__label">Current task</span>
          <h2>Example task</h2>
          <p>This is a placeholder task for the project skeleton.</p>
        </div>
        <Link to="/tasks/example-task">View task <span>→</span></Link>
      </div>
    </section>
  )
}
