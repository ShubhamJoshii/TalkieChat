import { NavLink } from "react-router-dom"

const PageNotFound = () => {
  return (
    <div id="PageNotFound">
        <h1>Oops!</h1>
        <h2>404 - PAGE NOT FOUND</h2>
        <p>The page you are looking for might have been removed<br /> had its name changed or is temporarily unavailable.</p>
        <NavLink to="/">GO TO HOMEPAGE</NavLink>
    </div>
  )
}

export default PageNotFound