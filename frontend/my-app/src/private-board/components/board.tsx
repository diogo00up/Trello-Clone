import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/board.css';
import add_plus from '../../icons/plus-circle.svg';
import FooterCustom from '../../footer/footer';
import HeaderCustom from '../../header/header-other';
import Ticket from './tickets';
import Column from './column';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import {TicketProps} from '../props/props'
import { createTicket, linkTicketToUser,updateTicket,ticketLoad } from '../services/axios-calls';

function MainTable() {
  const token = sessionStorage.getItem('access_token');
  const [title, setTitle] = useState<string>('New title');
  const [description, setDescription] = useState<string>('Insert new text');
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTicket = tickets.find((t) => t.id === activeId);
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    try {
      const response = await createTicket(title,description);
      await linkTicketToUser(response.owner_id, response.ticket_id);
      await handleTicketLoad();
    }
    catch (error) {
        console.error('Error creating new ticket or ticket-user relation:', error);
    }
    setShowPopup(false);
  };

  const updateTicketAfterDrag = async (ticket_id: number, ticket_class: string) => {
    try {
      const response = await updateTicket(ticket_id,ticket_class);
      console.log('Ticket class updated:', response);
    } 
    catch (error) {
      console.error('Error updating ticket class:', error);
    }
  };

  const handleTicketLoad = async () => {
    try {
      const response = await ticketLoad();
      setTickets(response);
      console.log("Sucesfull ticket load",response)
    } 
    catch (error) {
      console.error('Failed ticket load:', error);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id); 
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return
    
    updateTicketAfterDrag(active.id,over.id);

    if (active.id && over?.id) {
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === active.id ? { ...ticket, ticket_class: over.id } : ticket 
      );

      setTickets(updatedTickets);
    }

    setActiveId(null);
  };

  useEffect(() => {
    if (!sessionStorage.getItem('access_token')) {
      navigate('/welcome');
    }
    else{
      handleTicketLoad();
    }
  }, []);

  return (
    
    <div className="background">
       <HeaderCustom />  
       
      <div className='tool-bar'>

        <div className="add-ticket" onClick={() => setShowPopup(true)}>
          <img src={add_plus} className="add_plus" alt="add" />
          <span className="add-text">Create new ticket</span>
        </div>

      </div>

      {showPopup && (
        <div className="pop-put-new-ticket">
          <label htmlFor="title">New ticket title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label htmlFor="new-ticket-description">New ticket description:</label>
          <input type="text" id="new-ticket-description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          <button onClick={handleButtonClick}>Submit Ticket</button>
          <button onClick={() => setShowPopup(false)}>Cancel</button>
        </div>
      )}

      <div className="board-wrapper">

        <div className="titles">
          <a>Backlog</a>
          <a>Current Sprint</a>
          <a>In Progress</a>
          <a>Done</a>
        </div>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          
          <div className="main-board">
            <Column title="Backlog" ticketClass="backlog" tickets={tickets}  handleTicketLoad={handleTicketLoad} />
            <Column title="Sprint" ticketClass="current_sprint" tickets={tickets}  handleTicketLoad={handleTicketLoad} />
            <Column title="InProgress" ticketClass="in_progress" tickets={tickets}  handleTicketLoad={handleTicketLoad} />
            <Column title="Done" ticketClass="done" tickets={tickets}  handleTicketLoad={handleTicketLoad} />
          </div>

          <DragOverlay>
            {activeId && activeTicket ? (
              <Ticket id={activeTicket.id} title={activeTicket.title} text={activeTicket.text} ticket_class={activeTicket.ticket_class}  handleTicketLoad={handleTicketLoad} />) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <FooterCustom />
    </div>
  );
}

export default MainTable;
