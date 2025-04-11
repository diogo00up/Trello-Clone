import './header.css';
import symbol from './symbol.svg';

function HeaderCustom(){
    return (

      <div className='header'>

        <div className = 'header-title'>
            <h1 className='title'>Welcome to Trello!</h1>
        </div>

        <div className='header-subtitle'>
            <h3> Your personnel scheduler</h3>
        </div>

        <div className='header-icon'>
            <img src={symbol} className="HeaderLogoImage" alt="logo" />
        </div>

        <div className='header-line'>
            
        </div>

      </div>
  
    );
}

export default HeaderCustom;