import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    document.title = 'Your Title Here';
  }, []);

  return (
    <div>
      <h1>Welcome to My App</h1>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

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
        <a>Sky Group</a>
        <a>Language</a>
      </div>

    </div>

  );
}

function LogIn(){
  return(
    <div className = 'App'> 
      <header className ='SignUpPageHeader'>
        <img src={logo} className="Applogo" alt="logo" />  
        <div className ='formContainers'>
          <div className="createAccount">
            <header>Create Acount</header>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" />

            <label htmlFor="password1">Password:</label>
            <input type="password" id="password1" />

            <label htmlFor="password2">Confirm Password:</label>
            <input type="password" id="password2" />

            <button id="createButton">Create Account</button>
          </div>

          <div className = 'Login'>
            <header>Log In</header>
            <label htmlFor= 'logInUsername' >Username:</label>
            <input id = 'logInUsername' type = 'text'></input>

            <label htmlFor = 'LogInPassword'>Password:</label>
            <input id = 'LogInPassword' type = 'password'></input>

            <button id ='LogInButton'>Log In </button>

          </div>

          
        </div>

      </header>

      <FooterCustom />
    </div>
  );
}

export default LogIn;
