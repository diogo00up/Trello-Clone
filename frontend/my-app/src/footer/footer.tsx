import './footer.css';
import logo from '../images/logo.png';


function FooterCustom(){
    return (
      <div className='footer'>
  
        <div className='footerLogo'>
          <img src={logo} className="footerLogoImage" alt="logo" />
        </div>
  
        <div className = 'LogoInfo'>
          <a>© 2025 Trello PT</a>
        </div>
    
        <div className='footerMainContent'>
          <a>Privacy options</a>
          <a>Terms & conditions</a>
          <a>Privacy & cookies notice</a>
          <a>Accessibility</a>
          <a>Contact us</a>
        </div>
  
        <div className='footerMainContent2'>
          <a>TrelloGroup</a>
          <a>Language</a>
        </div>
  
      </div>
  
    );
}

export default  FooterCustom;
  