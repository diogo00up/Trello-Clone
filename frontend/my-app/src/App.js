import logo from './logo.svg';
import './App.css';

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

      <footer className ='SignUpPageFotter'>
        <p>Footer content goes here</p>
      </footer>

      


    </div>

  );
}

export default LogIn;
