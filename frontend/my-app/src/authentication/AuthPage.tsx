import { Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import { useState } from 'react';
import axios from 'axios';
import MainTable from '../OwnBoardPage'; 
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import FooterCustom from '../footer/footer'
import HeaderCustom from '../header/header';
import { forEachChild } from 'typescript';
import Menu from '../menu'


function App() {
  return (
    <>
      <Routes>
        <Route path="/welcome" element={<LogIn />} />
        <Route path="/mainPage" element={<MainTable />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>     
    </>
  );
}

function LogIn(){
  
  const navigate = useNavigate(); 
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [logInUsername, setLogInUsername] = useState<string>('');
  const [logInPassword, setLogInPassword] = useState<string>('');
  const [flag , setFlag] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [flag2 , setFlag2] = useState<boolean>(false);
  const [message2, setMessage2] = useState<string>('');

  const handleCreateAccount = async () => {

    console.log('Sign-up details:', { username, email, password1, password2 });
  
    if (password1 !== password2) {
      console.error('Passwords do not match!');
      setFlag2(true);
      setMessage2("The passwords do not match");
      return;
    }

    if(username.length < 6 ){
      setFlag2(true);
      setMessage2("Username too short");
      return;
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFlag2(true);
      setMessage2("Invalid email syntax");
      return;
    }
  
    try {
        const response = await axios.post('http://127.0.0.1:8000/users', {
        username,
        email,
        password: password1, 
      });
  
      console.log('CreateAccount successful:', response.data);
  
   
      setLogInUsername('');
      setLogInPassword('');

    } catch (error) {
      console.error('CreateAccountError:', error);
    }
  };

  const handleLogIn = async () => {

    console.log('Sign-up details:', { logInUsername, logInPassword });

    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
      logInUsername,
      logInPassword,

    });
    
    console.log('logIn successful:', response.data);
    sessionStorage.setItem('access_token', response.data.access_token);

    setUsername('');
    setEmail('');
    setPassword1('');
    setPassword2('');

    //CHANGE THIS NAVIGATE TO CHANGE PANGES FOR TESTING PURPOSES
    navigate('/menu');

    } catch (error) {
      console.error('LogIn Error:', error);
  
      setFlag(true);
      setMessage("Failed credentials or server issue");
    }
  };
  
  
  return(
    
    <div className = 'App'> 
      <header className ='SignUpPageHeader'>
        <HeaderCustom />  
        
        <div className ='formContainers'>

          <div className="createAccount">
            <header>Create Acount</header>
            <label htmlFor="username">Username:</label>
      
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password1">Password:</label>
            <input type="password" id="password1" value={password1} onChange={(e) => setPassword1(e.target.value)} />

            <label htmlFor="password2">Confirm Password:</label>
            <input type="password" id="password2" value={password2} onChange={(e) => setPassword2(e.target.value)} />

            <button id="createButton" onClick={handleCreateAccount}> Create Account</button>

            {flag2 && ( 
                <a id='error-message'>{message2}</a>  
            )}

          </div>

          <div className = 'Login'>
            <header>Log In</header>
            <label htmlFor= 'logInUsername' >Username:</label>
            <input id='logInUsername' type='text' value={logInUsername} onChange={(e) => setLogInUsername(e.target.value)}/>

            <label htmlFor = 'LogInPassword'>Password:</label>
            <input id = 'LogInPassword' type = 'password' value = {logInPassword} onChange={(e) => setLogInPassword(e.target.value)}/>

            <button id="LogInButton" onClick={handleLogIn}> Log In</button>

            {flag && ( 
                <a id='error-message'>{message}</a>  
            )}
          
          </div>

        </div>

      </header>
      <FooterCustom />
      


    </div>
  );
}

export default App;




