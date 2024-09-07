import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import {FaStar, FaSuitcase} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const jobApiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileApiStatus: profileApiStatusConstants.initial,
    jobApiStatus: jobApiStatusConstants.initial,
    profileData: {},
    jobDataList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
  }

  componentDidMount() {
    // Call both functions asynchronously
    this.getProfileData()
    this.getJobData()
  }

  getProfileData = async () => {
    this.setState({profileApiStatus: profileApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileApiUrl, option)
    const data = await response.json()

    if (response.ok) {
      const profile = data.profile_details
      const profileDetails = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }

      this.setState({
        profileData: profileDetails,
        profileApiStatus: profileApiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstants.failure})
    }
  }

  onProfileSuccess = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-cont">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  onProfileFailure = () => (
    <div className="failure-profile-cont">
      <h1>Profile Fail</h1>
      <button type="button" onClick={this.getProfileData} className="retry-btn">
        Retry
      </button>
    </div>
  )

  onLoader = () => (
    <div className="loader-container loader-spinner" data-testid="loader">
      <Loader type="ThreeDots" color="green" height="50" width="50" />
    </div>
  )

  onRenderProfile = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case profileApiStatusConstants.inProgress:
        return this.onLoader()
      case profileApiStatusConstants.success:
        return this.onProfileSuccess()
      case profileApiStatusConstants.failure:
        return this.onProfileFailure()
      default:
        return null
    }
  }

  onChangeEmploymentType = event => {
    const selectedType = event.target.value

    const {employmentType} = this.state
    let upadatedEmploymentType = []

    if (employmentType.includes(selectedType)) {
      upadatedEmploymentType = employmentType.filter(
        each => each !== selectedType,
      )
    } else {
      upadatedEmploymentType = [...employmentType, selectedType]
    }

    this.setState({employmentType: upadatedEmploymentType}, this.getJobData)
  }

  onRenderEmploymentTypeFilter = () => (
    <ul className="employment-category-cont">
      <h1 className="sorting-category-title">Type of Employment</h1>
      {employmentTypesList.map(each => (
        <li className="each-filter-category" key={each.employmentTypeId}>
          <input
            type="checkbox"
            value={each.employmentTypeId}
            onChange={this.onChangeEmploymentType}
            id={each.employmentTypeId}
          />
          <label htmlFor={each.employmentTypeId} className="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeSalaryRange = event => {
    const updatedSalaryRange = event.target.value

    this.setState({salaryRange: updatedSalaryRange}, this.getJobData)
  }

  onRenderSalaryRangeFilter = () => (
    <ul className="salaryRange-category-cont">
      <h1 className="sorting-category-title">Salary Range</h1>
      {salaryRangesList.map(each => (
        <li className="each-filter-category" key={each.salaryRangeId}>
          <input
            type="radio"
            value={each.salaryRangeId} // The value for this radio button
            onChange={this.onChangeSalaryRange} // Handle changes
            id={each.salaryRangeId}
            name="salaryRange" // Ensures only one radio button can be selected at a time
          />
          <label htmlFor={each.salaryRangeId} className="label">
            {each.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onDisplaySorting = () => (
    <>
      {this.onRenderEmploymentTypeFilter()}
      {this.onRenderSalaryRangeFilter()}
    </>
  )

  getJobData = async () => {
    this.setState({jobApiStatus: jobApiStatusConstants.inProgress})
    const {searchInput, employmentType, salaryRange} = this.state

    const employmentFilter = employmentType.join(',')
    console.log(employmentFilter)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, option)
    const data = await response.json()

    if (response.ok) {
      this.onSuccesJobDataApi(data.jobs)
    } else {
      this.setState({jobApiStatus: jobApiStatusConstants.failure})
    }
  }

  onSuccesJobDataApi = jobData => {
    const formattedJobDataList = jobData.map(each => ({
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      id: each.id,
      jobDescription: each.job_description,
      location: each.location,
      packagePerAnnum: each.package_per_annum,
      rating: each.rating,
      title: each.title,
    }))
    this.setState({
      jobDataList: formattedJobDataList,
      jobApiStatus: jobApiStatusConstants.success,
    })
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
      <button type="button" className="retry-btn" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  onRenderNoJobData = () => (
    <div className="failure-job-data-api-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="failure-img"
      />
      <h1 className="failure-title">No Jobs Found</h1>
      <p className="failure-desc">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onRenderJobData = () => {
    const {jobDataList} = this.state

    if (jobDataList.length === 0) {
      return this.onRenderNoJobData()
    }

    return (
      <ul className="job-lists-cont">
        {jobDataList.map(each => (
          <Link to={`jobs/${each.id}`} className="link" key={each.id}>
            <li className="job-list">
              <div className="company-logo-title-cont">
                <img
                  src={each.companyLogoUrl}
                  alt="company logo"
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
                <h1 className="job-desc-title">Description</h1>
                <p className="desc">{each.jobDescription}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  onDisplayJobDataList = () => {
    const {jobApiStatus} = this.state

    switch (jobApiStatus) {
      case jobApiStatusConstants.inProgress:
        return this.onLoader()
      case jobApiStatusConstants.success:
        return this.onRenderJobData()
      case jobApiStatusConstants.failure:
        return this.onFailureJobDataApi()
      default:
        return null
    }
  }

  onSearchBtn = () => {
    const {searchInput} = this.state

    this.setState({searchInput}, this.getJobData)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      const searchInputValue = event.target.value
      this.setState({searchInput: searchInputValue}, this.getJobData)
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="job-app-cont">
          <div className="profile_and_sorting_cont">
            <div className="search-cont-mobile">
              <input
                type="search"
                value={searchInput}
                onKeyDown={this.onKeyDownSearchInput}
                onChange={this.onChangeSearchInput}
                className="search-input"
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderProfile()}
            {this.onDisplaySorting()}
          </div>
          <div className="job-main-cont">
            <div className="search-cont-large">
              <input
                type="search"
                value={searchInput}
                onKeyDown={this.onKeyDownSearchInput}
                onChange={this.onChangeSearchInput}
                className="search-input"
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.onDisplayJobDataList()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
