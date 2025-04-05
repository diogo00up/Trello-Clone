import React from 'react';
import logo from './logo.svg';
import { useState } from 'react';
import axios from 'axios';
import './backlog.css';


function Backlog(){
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
  
export default Backlog;





