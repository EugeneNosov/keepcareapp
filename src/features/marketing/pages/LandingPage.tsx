import { Link } from 'react-router'

export function LandingPage() {
  return (
    <section>
      <h1>KeepCare</h1>
      <p>Marketing page</p>
      <nav>
        <Link to="/login">Log in</Link>
        {' · '}
        <Link to="/tasks">View tasks</Link>
      </nav>
    </section>
  )
}
