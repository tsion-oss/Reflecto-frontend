import { NavLink } from 'react-router-dom'
import Home from './Home'
import Mood from './Mood'
import Journal from './Journal'


export default function Nav() {
    return (
      <div className='sideBar'>
        <div>
              <NavLink style={{ textDecoration: 'none' }} to='/home'><h1>Reflecto</h1></NavLink>
         </div>
        
        <div className='options'>
          <ul>
            <li>
              <NavLink to='/home' activeClassName="active">My Reflection</NavLink>
            </li>
            <li>
              <NavLink to='/mood' activeClassName="active">My Moods</NavLink>
            </li>
            <li>
              <NavLink to='/journal' activeClassName="active">My Journals</NavLink>
            </li>
          </ul>
        </div>
       
        <div className="navUserSettingContainer">
        <NavLink className='navUserSetting' to='/usersetting'>User setting</NavLink>
      </div>
      
      </div>
    );
  }