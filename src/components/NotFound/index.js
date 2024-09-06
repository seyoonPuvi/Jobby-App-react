import './index.css'

const NotFound = () => (
  <div className="notfound-cont">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="not-found-cont"
    />
    <h1 className="title">Page Not Found</h1>
    <p className="desc">
      We are sorry, the page you requested could not be found.
    </p>
  </div>
)

export default NotFound
