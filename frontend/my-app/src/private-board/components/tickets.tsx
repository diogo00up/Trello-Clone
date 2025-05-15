import { useState} from 'react';
import axios from 'axios';
import '../styles/board.css';
import close from '../..//icons/x.svg'
import {useDraggable } from '@dnd-kit/core';
import {TicketProps} from '../props/props'


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

export default Ticket;