import { Link } from 'react-router'

export function TasksListPage() {
  return (
    <section>
      <h1>Tasks</h1>
      <p>Tasks feature page</p>
      <Link to="/tasks/example-task">Open an example task</Link>
    </section>
  )
}
