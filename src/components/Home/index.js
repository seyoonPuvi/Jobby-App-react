import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-cont">
      <div className="home-main-cont">
        <h1 className="home-title">Find The Job That Fits Your Life</h1>
        <p className="home-desc">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="link">
          <button type="button" className="custom-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
