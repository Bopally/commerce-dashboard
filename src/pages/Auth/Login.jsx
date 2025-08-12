import { useState } from 'react'
import { loginUser } from '../../services/api.service.jsx'
import './Login.css'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginResult, setLoginResult] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await loginUser(username, password)
      setLoginResult(result)
    } catch (err) {
      if (err.message.includes('400')) {
        setError(' ❌​ Invalid username or password, try again ✍🏼​')
      } else if (err.message.includes('401')) {
        setError('❌​ Authentication failed, try again ✍🏼​')
      } else {
        setError('Login failed. Please try again later')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loginResult && (
          <div className="success-message">
            <h3>Login Successful!</h3>
            <div className="user-info">
              <p>
                <strong>User ID:</strong> {loginResult.id}
              </p>
              <p>
                <strong>Username:</strong> {loginResult.username}
              </p>
              <p>
                <strong>Email:</strong> {loginResult.email}
              </p>
              <p>
                <strong>First Name:</strong> {loginResult.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {loginResult.lastName}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
