import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdHome} from 'react-icons/io'
import {FaSuitcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <div className="nav-bar-cont-mobile">
        <div className="nav-logo-cont">
          <Link to="/" className="link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </div>
        <ul className="nav-list-cont-mobile">
          <Link to="/" className="link">
            <li>
              <IoMdHome className="nav-icon" />
            </li>
          </Link>
          <Link to="/jobs" className="link">
            <li>
              <FaSuitcase className="nav-icon" />
            </li>
          </Link>
          <li>
            <button type="button" onClick={onLogout}>
              <FiLogOut className="nav-icon" />
            </button>
          </li>
        </ul>
      </div>

      <div className="nav-bar-cont-large">
        <div className="nav-logo-cont">
          <Link to="/" className="link">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="nav-logo"
            />
          </Link>
        </div>
        <ul className="nav-list-cont-large">
          <Link to="/" className="link">
            <li className="nav-list">Home</li>
          </Link>
          <Link to="/jobs" className="link">
            <li className="nav-list">Jobs</li>
          </Link>
        </ul>
        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </>
  )
}

export default withRouter(Header)
