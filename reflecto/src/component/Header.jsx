import { useState } from "react"
import logout from '../images/logout.png'
import Nav from '../component/Nav'

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false)

 const handleLogout = () => {
        localStorage.removeItem('jwtToken')
         window.location.href = '/'
      }
 
 const toUserSetting = () => {
    window.location.href = '/usersetting'
 }

const toggleDropdown = () => {
  setShowDropdown(!showDropdown)
}

    return(
      <header>
        <div className="account-info" onClick={toggleDropdown}>
           <img style={{ width: '50px' }} src={logout} />
        </div>
        {showDropdown && <div className="dropdown" id="dropdown">
           <p onClick={handleLogout}>Logout</p>

        </div>}
      </header>
    )
}