import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/board.css';
import add_plus from '../../icons/plus-circle.svg';
import FooterCustom from '../../footer/footer';
import HeaderCustom from '../../header/header-other';
import Ticket from './tickets';
import Column from './column';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useTickets } from '../hooks/useTickets';
import { TicketFormPopOuT } from './ticket-form-popout';

function MainTable() {
  const {
    tickets,
    setTickets,
    title,
    setTitle,
    description,
    setDescription,
    showPopup,
    setShowPopup,
    handleTicketLoad,
    updateTicketAfterDrag, 
    handleCreateTicket,       
  } = useTickets();

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTicket = tickets.find((t) => t.id === activeId);
  const navigate = useNavigate();

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

      {showPopup &&  <TicketFormPopOuT title={title} setTitle={setTitle} description={description} setDescription={setDescription}
      setShowPopup={setShowPopup} handleCreateTicket={handleCreateTicket} />}

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
