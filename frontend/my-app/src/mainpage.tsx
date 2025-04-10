import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './mainpage.css';
import add_plus from './add_plus.svg';
import FooterCustom from './footer'

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

      <div className='class-name-ticket'>
        <a id='call-id-ticket'>{ticket_class}</a>
      </div>
    
          
    </div>  
  );
}

function MainTable(){
  
  const token = sessionStorage.getItem('access_token');
  const [title, setTitle] = useState<string>('New title');
  const [description, setDescription] = useState<string>('Insert new text');
  const [tickets, setTickets] = useState<TicketProps[]>([]); 
  const [showPopup, setShowPopup] = useState<boolean>(false);



  const handleButtonClick = async () => {
    console.log('My session token is:', token);
  
    const ticket = {
      title,
      description
    };
  
    try {
      
      const response = await axios.post('http://127.0.0.1:8000/createTicket', ticket, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response from the API (Create Ticket):', response.data);
  
      const user_id = response.data.owner_id;
      const ticket_id = response.data.ticket_id;
  
      const ticketUser = {
        user_id,
        ticket_id
      };
  
      const relationResponse = await axios.post('http://127.0.0.1:8000/createTicketUserRelation', ticketUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log('Response from the API (Create TicketUser relation):', relationResponse.data);
  
    } catch (error) {
      console.error('Error creating new ticket or ticket-user relation:', error);
    }
  
    setShowPopup(false);
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

  const callTicketTemplate = async() =>{
    setShowPopup(true); 
  }

  const cancelTicketCreation = () => {
    setShowPopup(false); 
  };

  useEffect(() => {
    handleTicketLoad();
  }, []);
  
  return (
    <div className='background'>

      <div className="add-ticket" onClick={callTicketTemplate}>
        <img src={add_plus} className="add_plus" alt="add" />
        <span className="add-text">Create new ticket</span>
      </div>

      {showPopup && (
        <div className='pop-put-new-ticket'>
          <label htmlFor="title">New ticket title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>

          <label htmlFor="new-ticket-description">New ticket description:</label>
          <input type="text" id="new-ticket-description" value={description} onChange={(e) => setDescription(e.target.value)}/>

          <button onClick={handleButtonClick}>Submit Ticket</button>
          <button onClick={cancelTicketCreation}>Cancel</button>
        </div>
      )}

      <div className="board-wrapper">
        <div className='titles'>
          <a>Backlog</a>
          <a>Current Sprint</a>
          <a>In Progress</a>
          <a>Done</a>
          
        </div>

        <div className='main-board'>
          <Column title="Backlog" ticketClass="backlog" tickets={tickets} />
          <Column title="Sprint" ticketClass="current_sprint" tickets={tickets} />
          <Column title="InProgress" ticketClass="in_progress" tickets={tickets} />
          <Column title="Done" ticketClass="done" tickets={tickets} />
        </div>
      </div>

      <FooterCustom />
    </div>
    
  );
}
  
export default MainTable;





