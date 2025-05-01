import './header-auth-page.css';
import symbol from '../images/symbol.svg';
import logo from '../images/logo.png';

function Header_Auth_Page(){
    return (

      <div className='header'>

        <div className = 'header-title'>
            <h1 className='title'>Welcome to Trello!</h1>
        </div>

        <div className='header-subtitle'>
            <h3> Your personnel scheduler</h3>
        </div>

        <div className='header-icon'>
           <img src={logo}  alt="logo" className='header-icon-image' />
        </div>

      

      </div>
  
    );
}

export default Header_Auth_Page;