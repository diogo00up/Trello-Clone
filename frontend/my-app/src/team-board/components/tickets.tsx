import { useState} from 'react';
import axios from 'axios';
import '../styles/board.css';
import google from '../../icons/google.svg'
import close from '../../icons/x.svg'
import calendar from '../../icons/calendar1.svg'
import {useDraggable } from '@dnd-kit/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {TicketProps} from '../props/props';


function GroupTicket({id, title, description,ticket_owner, ticket_class, group_id, date_deliver, loadGroupTickets}: TicketProps){
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedText, setEditedText] = useState(description); 
    const [isEditing, setIsEditing] = useState(false); 
    const { attributes, listeners, setNodeRef, transform } = useDraggable({id, disabled: isEditing, });
    const [openPicker, setOpenPicker] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(date_deliver));
    const [ticketDate, setTicketDate] = useState<Date>(new Date(date_deliver));
    const token = sessionStorage.getItem('access_token');
    

    const handleCancel = () => {
      setEditedTitle(title);
      setEditedText(description);
      setIsEditing(false);
    };

    const style = {
      transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
      cursor: isEditing ? 'text' : 'grab', 
    };

    const updateTicketInfo = async () => {
      console.log(description);
      try {
  
        const response = await axios.put('http://127.0.0.1:8000/updateGroupTextTitle', {
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
    
        console.log('Group Ticket text and title updated:', response.data);
     
        await loadGroupTickets();
        
      } 
      catch (error) {
        console.error('Error updating  Group ticket title and text:', error);
      }
    };

    const deleteTicket = async () => {
      console.log("presseded delete button with id:", id);

      if (!window.confirm("Are you sure you want to delete this ticket?")) return;

      try {

        const response = await axios.delete('http://127.0.0.1:8000/deleteGroupTicket', {
  
          headers: {
            Authorization: `Bearer ${token}`,
          },
  
          data: { id: id }  
        });
  
        console.log('GroupTicket deleted: ', response.data);

        await loadGroupTickets();
     
        
      } 
      catch (error) {
        console.error('Error deleting ticket', error);
      }
    
    };

    const updateTicketDate = async (newDate: Date) => {
      console.log(newDate);
      console.log("CALLING API TO UPDATE DATE");
      const formattedDate = newDate.toISOString().split('T')[0]; 
      try {
  
        const response = await axios.put('http://127.0.0.1:8000/updateTicketDate', {
          id: id,
          date: formattedDate,
        },
        
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
        console.log('Group Ticket date updated:', response.data);
     
        //await loadGroupTickets();
        setTicketDate(newDate);
        
      } 
      catch (error) {
        console.error('Error updating  Group ticket date:', error);
      }

    };

    const handleDateChange = (date: Date | null) => {
      if (date) {
        setSelectedDate(date);
        updateTicketDate(date);
      }
    };

    const SetGoogleCalendarDate = async (date: Date | null) => {
      console.log("Goodle Auth!");
      console.log(date);
      
      if(date==null){
        return;
      }

      const google_token = sessionStorage.getItem('google_token');
      console.log(google_token);
      if (!google_token) {
        console.error("No Google token found in session.");
        await GoogleAuth();
      }

    

      const startDateTime = new Date(date);
      startDateTime.setHours(23, 0, 0, 0); // 23:00:00.000
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const eventData = {
        summary: "Trello Ticket Delivery",
        description: "This is a test event created via Google Calendar API",
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "America/New_York"
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "America/New_York"
        }
      };

      console.log(eventData);

      try {
        const response = await axios.post( 'http://127.0.0.1:8000/google/create_event',
          eventData, 
          {
            headers: {
              Authorization: `Bearer ${google_token}`
            }
          }
        );
        
        console.log("Sent Resquest calendar API: ",response.data)
      
      }
      catch (error) {
        console.error('Error connectint to calendar API:', error);
      }

        
    }
   
    const GoogleAuth = async () => {
      console.log("Goodle Auth!");
      window.location.href = 'http://127.0.0.1:8000/auth/google';
    }
   

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

          <div className="ticket-date">
            <span>Deliver date: {new Date(ticketDate).toLocaleDateString()}</span>
            <img src={calendar} className="calendar-button"  onPointerDown={(e) => e.stopPropagation()} onClick={() => setOpenPicker(true)} />
            <img src={google} className="google-button"  onPointerDown={(e) => e.stopPropagation()}  onClick={() => SetGoogleCalendarDate(new Date(ticketDate))}/>  
          </div>
          
          {openPicker && (
            <div className='date-picker-div' onPointerDown={(e) => e.stopPropagation()}>
              <DatePicker 
                selected={selectedDate} 
                onChange={handleDateChange} 
                dateFormat="dd/MM/yyyy"
                inline
                onClickOutside={() => setOpenPicker(false)}
                onSelect={() => setOpenPicker(false)}
              />
            </div>
          )}                    
        </div>
      );
}

export default GroupTicket;

