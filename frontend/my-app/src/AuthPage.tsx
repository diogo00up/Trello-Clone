import { Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import { useState } from 'react';
import axios from 'axios';
import MainTable from './OwnBoardPage'; 
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import FooterCustom from './footer/footer'
import HeaderCustom from './header/header';


function App() {
  return (
    <>
      <Routes>
        <Route path="/welcome" element={<LogIn />} />
        <Route path="/mainPage" element={<MainTable />} />
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

  const handleCreateAccount = async () => {

    console.log('Sign-up details:', { username, email, password1, password2 });
  
    if (password1 !== password2) {
      console.error('Passwords do not match!');
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

    navigate('/mainpage');

    } catch (error) {
      console.error('LogIn Error:', error);
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
          </div>

          <div className = 'Login'>
            <header>Log In</header>
            <label htmlFor= 'logInUsername' >Username:</label>
            <input id='logInUsername' type='text' value={logInUsername} onChange={(e) => setLogInUsername(e.target.value)}/>

            <label htmlFor = 'LogInPassword'>Password:</label>
            <input id = 'LogInPassword' type = 'password' value = {logInPassword} onChange={(e) => setLogInPassword(e.target.value)}/>

            <button id="LogInButton" onClick={handleLogIn}> Log In</button>
          
          </div>

        </div>

      </header>
      <FooterCustom />
      


    </div>
  );
}

export default App;




