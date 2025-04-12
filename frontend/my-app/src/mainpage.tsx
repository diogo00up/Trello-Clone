import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './mainpage.css';
import add_plus from './add_plus.svg';
import FooterCustom from './footer';
import HeaderCustom from './header';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';

type TicketProps = {
  id: string;   
  title: string;
  text: string;
  ticket_class: string;
};

type ColumnProps = {
  title: string;
  ticketClass: string;
  tickets: TicketProps[];
};

function Column({ title, ticketClass, tickets }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: ticketClass });

  return (
    <div className="indivual_column" ref={setNodeRef} title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket, index) => (
          <Ticket key={ticket.id} id={ticket.id} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class}/>))}
    </div>
  );
}

function Ticket({ id, title, text, ticket_class }: TicketProps) {

  const [isEditing, setIsEditing] = useState(false); 
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedText, setEditedText] = useState(text); 

  const { attributes, listeners, setNodeRef, transform } = useDraggable({id, disabled: isEditing, });

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedText(text);
    setIsEditing(false);
  };

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    cursor: isEditing ? 'text' : 'grab', 
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="ticketbox">

      <div className="ticketTitle"  onPointerDown={(e) => e.stopPropagation()}>
          {isEditing ? ( <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>) : (<input type="text" value={editedTitle} readOnly onClick={() => setIsEditing(true)} />)}
      </div>

      <div className="tickerText" onPointerDown={(e) => e.stopPropagation()}>
        {isEditing ? ( <textarea value={editedText}  onChange={(e) => setEditedText(e.target.value)} /> ) : (<textarea value={editedText} readOnly onClick={() => setIsEditing(true)} />)}
      </div>

      {isEditing && (
        <div className="edit-buttons">
          <button onClick={() => setIsEditing(false)}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
      
      <div className="class-name-ticket">
        <a id="call-id-ticket">{ticket_class}</a>
      </div>
    </div>
  );
}



function MainTable() {
  const token = sessionStorage.getItem('access_token');
  const [title, setTitle] = useState<string>('New title');
  const [description, setDescription] = useState<string>('Insert new text');
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTicket = tickets.find((t) => t.id === activeId);

  const handleButtonClick = async () => {
    const ticket = { title, description };

    try {
      const response = await axios.post('http://127.0.0.1:8000/createTicket', ticket, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user_id = response.data.owner_id;
      const ticket_id = response.data.ticket_id;

      const ticketUser = { user_id, ticket_id };

      await axios.post('http://127.0.0.1:8000/createTicketUserRelation', ticketUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await handleTicketLoad();
    } catch (error) {
      console.error('Error creating new ticket or ticket-user relation:', error);
    }

    setShowPopup(false);
  };
  const updateTicketAfterDrag = async (ticket_id: number, ticket_class: string) => {
    try {

      const response = await axios.put('http://127.0.0.1:8000/updatedtickets', {
        ticket_id: ticket_id,
        ticket_class: ticket_class,
      });
  
      console.log('Ticket updated:', response.data);
    } 
    catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleTicketLoad = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/loadTickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loadedTickets = response.data.tickets.map((ticket: any) => ({
        id: ticket.id, 
        title: ticket.title,
        text: ticket.description,
        ticket_class: ticket.ticket_class,
      }));

      setTickets(loadedTickets);
    } catch (error) {
      console.error('LogIn Error:', error);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id); 
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    console.log("Coluna que vou dropar: ",over.id);
    console.log("id do ticket que vou dropar: ", Number(active.id));
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
    handleTicketLoad();
  }, []);

  return (
    
    <div className="background">
       <HeaderCustom />  

      <div className="add-ticket" onClick={() => setShowPopup(true)}>
        <img src={add_plus} className="add_plus" alt="add" />
        <span className="add-text">Create new ticket</span>
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
            <Column title="Backlog" ticketClass="backlog" tickets={tickets} />
            <Column title="Sprint" ticketClass="current_sprint" tickets={tickets} />
            <Column title="InProgress" ticketClass="in_progress" tickets={tickets} />
            <Column title="Done" ticketClass="done" tickets={tickets} />
          </div>

          <DragOverlay>
            {activeId && activeTicket ? (
              <Ticket id={activeTicket.id} title={activeTicket.title} text={activeTicket.text} ticket_class={activeTicket.ticket_class} />) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <FooterCustom />
    </div>
  );
}

export default MainTable;
