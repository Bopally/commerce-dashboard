import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/api.service.ts'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loginResult, setLoginResult] = useState(null)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (error || loginResult) {
      const timer = setTimeout(() => {
        setError(null)
        setLoginResult(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error, loginResult])

  const closeMessage = () => {
    setError(null)
    setLoginResult(null)
  }

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password')
      setLoginResult(null)
      return
    }

    setIsLoading(true)
    setError(null)
    setLoginResult(null)
    try {
      const result = await loginUser(username, password)
      setLoginResult(result)
      setError(null)

      // Store JWT token and user info in localStorage
      if (result.accessToken) {
        localStorage.setItem('authToken', result.accessToken)

        // Determine user role based on username or other criteria
        const isAdmin = ['emilys', 'admin'].includes(result.username)

        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            firstName: result.firstName,
            lastName: result.lastName,
            username: result.username,
            email: result.email,
            role: isAdmin ? 'admin' : 'user',
            id: result.id,
          })
        )

        // Redirect based on role
        setTimeout(() => {
          if (isAdmin) {
            navigate('/commerce-dashboard/admin')
          } else {
            navigate('/commerce-dashboard')
          }
        }, 2000) // Wait 2 seconds to show success message
      }
    } catch (err) {
      setLoginResult(null)
      if (err.message.includes('400')) {
        setError('Invalid username or password, try again ✍🏼​')
      } else if (err.message.includes('401')) {
        setError('Authentication failed, try again ✍🏼​')
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
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Homepage
        </button>
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

        <div className="login-instructions">
          <p>
            📝 <strong>Test Credentials:</strong>
          </p>

          <div className="credentials-section">
            <p>
              <strong>👑 Admin Access:</strong>
            </p>
            <p>
              <strong>Username:</strong> emilys
            </p>
            <p>
              <strong>Password:</strong> emilyspass
            </p>
            <small>Access to admin panel and product management</small>
          </div>

          <div className="credentials-section">
            <p>
              <strong>👤 Regular User:</strong>
            </p>
            <p>
              <strong>Username:</strong> michaelw
            </p>
            <p>
              <strong>Password:</strong> michaelwpass
            </p>
            <small>Access to personal carts and user features</small>
          </div>
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
            <button className="close-button" onClick={closeMessage}>
              ✖️​
            </button>
            <p>{error}</p>
          </div>
        )}

        {loginResult && (
          <div className="success-message">
            <button className="close-button" onClick={closeMessage}>
              ✖️​
            </button>
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
