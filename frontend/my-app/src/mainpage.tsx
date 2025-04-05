import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './mainpage.css';
import add_plus from './add_plus.svg';

function Ticket(){
  const [title, setTitle] = useState<string>('click to change your title');
  const [text, setText] = useState<string>('click to change your text');

  return (
    <div className="ticketbox">
      
      <div className = "ticketTitle">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className='tickerText'>
        <textarea value={text} onChange={(e) => setText(e.target.value)}/>
      </div>
          
    </div>  
  );
}






function MainTable(){
  
  const token = sessionStorage.getItem('access_token');
  const [title, setTitle] = useState<string>('New title');
  const [description, setDescription] = useState<string>('Insert new text');

  
  const handleButtonClick = async () => {

    console.log('my session token is : ',token);

    const ticket = {
      title,
      description
    };

  
    try {
      const response = await axios.post('http://127.0.0.1:8000/createTicket', ticket,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response from the API:', response.data);
  
    }catch (error) {
        console.error('LogIn Error:', error);
      }

  };



  const handleTicketLoad = async () => {
    console.log("chamei a funcao")

  };





  return (
    <div>

    <div className="add-ticket" onClick={handleButtonClick}>
      <img src={add_plus} className="add_plus" alt="add" />
      <span className="add-text">Click to add new ticket</span>
    </div>


    <div className="add-ticket" onClick={handleTicketLoad}>
      <img src={add_plus} className="add_plus" alt="add" />
      <span className="add-text">Click to load the tickets</span>
    </div>


    </div>
    
  );
}
  
export default MainTable;





