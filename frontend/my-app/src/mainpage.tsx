import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './mainpage.css';
import add_plus from './add_plus.svg';

type TicketProps = {
  title: string;
  text: string;
  ticket_class : string;
};


function Ticket({ title, text, ticket_class }: TicketProps){

  return (
    <div className="ticketbox">
      
      <div className = "ticketTitle">
        <input type="text" value={title} readOnly />
      </div>

      <div className='tickerText'>
        <textarea value={text} readOnly />
      </div>
      <a>{ticket_class}</a>
          
    </div>  
  );
}


function MainTable(){
  
  const token = sessionStorage.getItem('access_token');
  const [title, setTitle] = useState<string>('New title');
  const [description, setDescription] = useState<string>('Insert new text');
  const [tickets, setTickets] = useState<TicketProps[]>([]); // store list of tickets

  
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
    console.log("chamei a funcao");
    console.log('my session token is : ',token);

    try {
      const response = await axios.get('http://127.0.0.1:8000/loadTickets',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response from the API:', response.data);

      const loadedTickets = response.data.tickets.map((ticket: any) => ({
        title: ticket.title,
        text: ticket.description,
        ticket_class : ticket.ticket_class,
      }));

      setTickets(loadedTickets);
  
    }
    catch (error) {
        console.error('LogIn Error:', error);
      }

  };

  return (
    <div className='background'>

      <div className="add-ticket" onClick={handleButtonClick}>
        <img src={add_plus} className="add_plus" alt="add" />
        <span className="add-text">Click to add new ticket</span>
      </div>

      <div className="add-ticket" onClick={handleTicketLoad}>
        <img src={add_plus} className="add_plus" alt="add" />
        <span className="add-text">Click to load the tickets</span>
      </div>

  

      <div className='main-board'>

        <div className="indivual_column">
          <h3 className="column-title" title='backlog'>Backlog</h3>
          {tickets.filter(ticket => ticket.ticket_class === 'backlog').map((ticket, index) => (
            <Ticket key={index} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class} /> ))}
        </div>

        <div className="indivual_column" title='current_sprint'>
          <h3 className="column-title">Sprint</h3>
          {tickets.filter(ticket => ticket.ticket_class === 'current_sprint').map((ticket, index) => (
            <Ticket key={index} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class} /> ))}
        </div>

        <div className="indivual_column" title='in_progress'>
          <h3 className="column-title">InProgress</h3>
          {tickets.filter(ticket => ticket.ticket_class === 'in_progress').map((ticket, index) => (
            <Ticket key={index} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class} /> ))}
        </div>

        <div className="indivual_column" title='done'>
          <h3 className="column-title">Done</h3>
          {tickets.filter(ticket => ticket.ticket_class === 'done').map((ticket, index) => (
            <Ticket key={index} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class} /> ))}
        </div>
      
      </div>

 


    </div>
    
  );
}
  
export default MainTable;





