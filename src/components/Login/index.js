import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 2})
    history.replace('/')
  }

  onSubmitUserDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {
      username,
      password,
    }

    const option = {
      method: 'POST',
      body: JSON.stringify(userData),
    }

    const loginApiUrl = 'https://apis.ccbp.in/login'

    const response = await fetch(loginApiUrl, option)
    const data = await response.json()

    if (response.ok) {
      const jwtToken = data.jwt_token
      this.onSubmitSuccess(jwtToken)
    } else {
      const errorMsg = data.error_msg
      this.setState({errorMsg, showError: true})
    }
  }

  onRenderUsername = () => {
    const {username} = this.state
    return (
      <div className="input-cont">
        <label htmlFor="username" className="input-label">
          USERNAME
        </label>
        <input
          id="username"
          placeholder="Username : rahul"
          value={username}
          onChange={this.onChangeUsername}
          className="input"
        />
      </div>
    )
  }

  onRenderPassword = () => {
    const {password} = this.state
    return (
      <div className="input-cont">
        <label htmlFor="password" className="input-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password : rahul@2021"
          value={password}
          onChange={this.onChangePassword}
          className="input"
        />
      </div>
    )
  }

  render() {
    const {showError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')

    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-app-cont">
        <div className="login-main-cont">
          <div className="login-logo-cont">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-logo"
            />
          </div>
          <form onSubmit={this.onSubmitUserDetails} className="form-cont">
            {this.onRenderUsername()}
            {this.onRenderPassword()}
            {showError && <p className="error-txt">*{errorMsg}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
