import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OwnBoardPage.css';
import add_plus from './icons/add_plus.svg';
import user_icon from './icons/user_icon.svg';
import log_out from './icons/log_out.svg'
import close from './icons/close.svg'
import back from './icons/back.svg'
import FooterCustom from './footer/footer';
import HeaderCustom from './header/header';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';

type TicketProps = {
  id: string;   
  title: string;
  text: string;
  ticket_class: string;
  handleTicketLoad: () => void;

};

type ColumnProps = {
  title: string;
  ticketClass: string;
  tickets: TicketProps[];
  handleTicketLoad: () => void;

};

function Column({ title, ticketClass, tickets, handleTicketLoad }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: ticketClass });

  return (
    <div className="indivual_column" ref={setNodeRef} title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket, index) => (
          <Ticket key={ticket.id} id={ticket.id} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class}  handleTicketLoad={handleTicketLoad} />))}
    </div>
  );
}

function Ticket({id, title, text, ticket_class, handleTicketLoad }: TicketProps) {

  const [isEditing, setIsEditing] = useState(false); 
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedText, setEditedText] = useState(text); 
  const token = sessionStorage.getItem('access_token');
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
  
  const updateTicketInfo = async () => {
    try {

      const response = await axios.put('http://127.0.0.1:8000/updateTextTitle', {
        id: id,
        title: editedTitle,
        text: editedText,
      },
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
      console.log('Ticket text and title updated:', response.data);
   
      await handleTicketLoad();
      
    } 
    catch (error) {
      console.error('Error updating ticket title and text:', error);
    }
  };

  const deleteTicket = async () => {
    console.log("presseded delete button with id:", id)

    try {

      const response = await axios.delete('http://127.0.0.1:8000/deleteTicket', {

        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: { id: id }  
      });

      console.log('Ticket and UserTicket deleted: ', response.data);
   
      await handleTicketLoad();
      
    } 
    catch (error) {
      console.error('Error updating ticket title and text:', error);
    }

  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="ticketbox">

      <img src={close} className="close-button" alt="add" onPointerDown={(e) => e.stopPropagation()} onClick={() => deleteTicket()} />

      <div className="ticketTitle"  onPointerDown={(e) => e.stopPropagation()}>
          {isEditing ? ( <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>) : (<input type="text" value={editedTitle} readOnly onClick={() => setIsEditing(true)} />)}
      </div>

      <div className="tickerText" onPointerDown={(e) => e.stopPropagation()}>
        {isEditing ? ( <textarea value={editedText}  onChange={(e) => setEditedText(e.target.value)} /> ) : (<textarea value={editedText} readOnly onClick={() => setIsEditing(true)} />)}
      </div>

      {isEditing && (
        <div className="edit-buttons">
          <button onClick={() => {setIsEditing(false); updateTicketInfo();}}>Save</button>
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
  const navigate = useNavigate();

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

      const response = await axios.put('http://127.0.0.1:8000/updatedtickets', { ticket_id, ticket_class }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      console.log('Ticket updated:', response.data);
    } catch (error) {
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
    } 
    catch (error) {
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

  const logOut = async () => {
    console.log("logout");
    sessionStorage.clear();
    navigate('/welcome');
    
  }

  const goBack = async () => {
    console.log("goback");
    navigate('/menu');
    
  }


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

        <div className='user-icon'>
          <img src={user_icon} className="add_plus" alt="add" />
          <span className="add-text">Edit user settings</span>
        </div>

        <div className='user-icon' onClick={logOut}>
          <img src={log_out} className="add_plus" alt="add" />
          <span className="add-text">Exit</span>
        </div>

        <div className='user-icon' onClick={goBack}>
          <img src={back} className="add_plus" alt="add" />
          <span className="add-text">Go Back</span>
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
