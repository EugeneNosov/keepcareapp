import { LuArrowLeft, LuHeartPulse, LuLockKeyhole } from 'react-icons/lu'
import { Link } from 'react-router'

export function LoginPage() {
  return (
    <div className="login-page">
      <Link className="login-page__back" to="/">
        <LuArrowLeft aria-hidden="true"/>
        Back to home
      </Link>

      <section className="login-shell">
        <aside className="login-shell__intro">
          <div className="login-shell__brand">
            <span>
              <LuHeartPulse aria-hidden="true"/>
            </span>
            KeepCare
          </div>

          <div className="login-shell__message">
            <h1>Welcome<br/>back.</h1>
            <p>
              Sign in to review your tasks and keep the important things moving.
            </p>
          </div>
        </aside>

        <div className="login-form">
          <div className="login-form__heading">
            <span><LuLockKeyhole aria-hidden="true"/></span>
            <div>
              <h2>Sign in</h2>
            </div>
          </div>

          <div className="login-form__fields">
            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </label>

            <button type="button">
              Login
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
