import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './mainpage.css';
import add_plus from './add_plus.svg';


type TicketProps = {
  title: string;
  text: string;
  ticket_class : string;
};

type ColumnProps = {
  title: string;
  ticketClass: string;
  tickets: TicketProps[];
};


function Column({ title, ticketClass, tickets }: ColumnProps) {
  return (
    <div className="indivual_column" title={ticketClass}>
      <h3 className="column-title">{title}</h3>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket, index) => (
        <Ticket key={index} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class}/>
        ))}
    </div>
  );
}


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

  useEffect(() => {
    handleTicketLoad();
  }, []);

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

        <Column title="Backlog" ticketClass="backlog" tickets={tickets} />
        <Column title="Sprint" ticketClass="current_sprint" tickets={tickets} />
        <Column title="InProgress" ticketClass="in_progress" tickets={tickets} />
        <Column title="Done" ticketClass="done" tickets={tickets} />
            
      </div>
      
    </div>
    
  );
}
  
export default MainTable;





