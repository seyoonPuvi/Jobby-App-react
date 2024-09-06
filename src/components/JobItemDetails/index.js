import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaSuitcase, FaExternalLinkAlt} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemData: {},
  }

  componentDidMount() {
    this.getJobItemData()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    const {params} = match
    const {id} = params

    if (prevProps.match.params.id !== id) {
      this.getJobItemData()
    }
  }

  getJobItemData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')

    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, option)

    if (response.ok) {
      const data = await response.json()
      this.onSuccessJobItemData(data)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSuccessJobItemData = data => {
    const updatedJobDetailsData = {
      companyLogoUrl: data.job_details.company_logo_url,
      companyWebsiteUrl: data.job_details.company_website_url,
      employmentType: data.job_details.employment_type,
      id: data.job_details.id,
      jobDescription: data.job_details.job_description,
      skills: data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      })),
      lifeAtCompany: {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      },
      location: data.job_details.location,
      packagePerAnnum: data.job_details.package_per_annum,
      rating: data.job_details.rating,
      title: data.job_details.title,
    }

    const updatedSimilarJobsData = data.similar_jobs.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      rating: each.rating,
      title: each.title,
    }))

    this.setState({
      jobItemData: {
        jobDetails: updatedJobDetailsData,
        similarJobs: updatedSimilarJobsData,
      },
      apiStatus: apiStatusConstants.success,
    })
  }

  onRenderJobItemDetails = () => {
    const {jobItemData} = this.state
    const {jobDetails} = jobItemData
    console.log(jobDetails)

    return (
      <>
        <div className="jobItemData-main-cont">
          <div className="job-info-cont">
            <div className="company-logo-title-cont">
              <img
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="company-title-cont">
                <h1 className="company-title">{jobDetails.title}</h1>
                <div className="rating-cont">
                  <FaStar className="star-icon" />
                  <p className="rating">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-cont">
              <div className="location-cont">
                <MdLocationOn className="location-icon" />
                <p className="location">{jobDetails.location}</p>
              </div>
              <div className="employment-type-cont">
                <FaSuitcase className="job-icon" />
                <p className="employment-type">{jobDetails.employmentType}</p>
              </div>
              <p className="salary">{jobDetails.packagePerAnnum}</p>
            </div>
            <div className="job-jobDescription-cont">
              <div className="link-cont">
                <h1 className="title">Description</h1>
                <div>
                  <a
                    href={jobDetails.companyWebsiteUrl}
                    className="website-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit
                  </a>
                  <FaExternalLinkAlt className="link-icon" />
                </div>
              </div>

              <p className="desc">{jobDetails.jobDescription}</p>
            </div>
          </div>
          {this.onRenderSkills()}
          {this.onRenderCompanyDetails()}
        </div>
        {this.onRenderSimilarJobs()}
      </>
    )
  }

  onRenderSkills = () => {
    const {jobItemData} = this.state
    const {jobDetails} = jobItemData
    const {skills} = jobDetails

    return (
      <div className="skill-cont">
        <h1 className="title">Skills</h1>
        <ul className="skills-lists-cont">
          {skills.map(each => (
            <li className="each-skill" key={each.name}>
              <img src={each.imageUrl} alt={each.name} className="skill-img" />
              <p className="skill-name">{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onRenderCompanyDetails = () => {
    const {jobItemData} = this.state
    const {jobDetails} = jobItemData
    const {lifeAtCompany} = jobDetails
    const {imageUrl, description} = lifeAtCompany

    return (
      <div className="life_at_company-cont">
        <h1 className="title">Life at Company</h1>
        <div className="company-info">
          <p className="desc company-desc">{description}</p>
          <img src={imageUrl} alt="life at company" className="company-image" />
        </div>
      </div>
    )
  }

  onRenderSimilarJobs = () => {
    const {jobItemData} = this.state
    const {similarJobs} = jobItemData

    return (
      <div className="similar-job-cont">
        <h1 className="title">Similar Jobs</h1>
        <ul className="similar-jobs-list-cont">
          {similarJobs.map(each => (
            <Link
              to={`/jobs/${each.id}`}
              key={each.id}
              className="link similar-job-list"
            >
              <li>
                <div className="company-logo-title-cont">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="company-title-cont">
                    <h1 className="company-title">{each.title}</h1>
                    <div className="rating-cont">
                      <FaStar className="star-icon" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-package-cont">
                  <div className="location-cont">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{each.location}</p>
                  </div>
                  <div className="employment-type-cont">
                    <FaSuitcase className="job-icon" />
                    <p className="employment-type">{each.employmentType}</p>
                  </div>
                  <p className="salary">{each.packagePerAnnum}</p>
                </div>
                <div className="job-jobDescription-cont">
                  <h1 className="title">Description</h1>
                  <p className="desc">{each.jobDescription}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  onLoader = () => (
    <div className="loader-container loader-spinner" data-testid="loader">
      <Loader type="ThreeDots" color="green" height="50" width="50" />
    </div>
  )

  onDisplayJobsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.onLoader()
      case apiStatusConstants.success:
        return this.onRenderJobItemDetails()
      case apiStatusConstants.failure:
        return this.onFailureJobDataApi()
      default:
        return <h1>not found</h1>
    }
  }

  onFailureJobDataApi = () => (
    <div className="failure-job-data-api-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-title">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobItemData}>
        Retry
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="jobItemData-app-cont">
          {this.onDisplayJobsDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
