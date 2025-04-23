import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './teamsBoardPage.css';
import FooterCustom from './footer/footer';
import HeaderCustom from './header/header';
import add_plus from './icons/add_plus.svg';
import user_icon from './icons/user_icon.svg';
import log_out from './icons/log_out.svg'
import close from './icons/close.svg'
import back from './icons/back.svg'

type groupProps = {
    id: number;
    group_name: string;
  };
  
type GroupChoiceProps = {
currentGroup?: groupProps;
groupList: groupProps[];
SetCurrentGroup: React.Dispatch<React.SetStateAction<groupProps | undefined>>;
};

type TicketProps = {
    id: number;   
    title: string;
    description: string;
    ticket_owner : number;
    ticket_class: string;
    group_id : number;  
    loadGroupTickets: () => void;
};

type ColumnProps = {
    title: string;
    ticketClass: string;
    tickets: TicketProps[];  
    loadGroupTickets: () => void;
};

function Column({title, ticketClass, tickets, loadGroupTickets }: ColumnProps) {
  return (
    <div className="indivual_column" title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket) => {

        return (
          <GroupTicket key={ticket.id} id={ticket.id} title={ticket.title} description={ticket.description} ticket_owner={ticket.ticket_owner} ticket_class={ticket.ticket_class} group_id={ticket.group_id} loadGroupTickets={loadGroupTickets}/>
        );
        })}
    </div>
  );
}

function GroupTicket({id, title, description,ticket_owner, ticket_class, group_id, loadGroupTickets}: TicketProps){
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedText, setEditedText] = useState(description); 
    const [isEditing, setIsEditing] = useState(false); 
    const token = sessionStorage.getItem('access_token');

    const handleCancel = () => {
      setEditedTitle(title);
      setEditedText(description);
      setIsEditing(false);
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
   

    return (
        <div className="ticketbox">

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


function GroupChoice({ currentGroup, groupList, SetCurrentGroup }: GroupChoiceProps){
    return(

      <div className='group_choice'>
        <a id='group-choice-a'>Scroll threw your working teams: </a>
        <select className='group-box' value={currentGroup?.id || ''} onChange={(e) => {const selectedId = parseInt(e.target.value);
        const selectedGroup = groupList.find(group => group.id === selectedId);
        SetCurrentGroup(selectedGroup)}}>

        <option value="" disabled>Select a group</option>

        {groupList.map(group => (
            <option key={group.id} value={group.id}>{group.group_name} </option>))
        }

        </select>
    </div>

    )
};

function GroupPage(){
    const [Groups, SetGroups] = useState<groupProps[]>([]);
    const [currentGroup, SetCurrentGroup] = useState<groupProps>();
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const token = sessionStorage.getItem('access_token');
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('New title');
    const [description, setDescription] = useState<string>('Insert new text');

    const navigate = useNavigate();

    const handleButtonClick = async () => {
      const group_id = currentGroup?.id;
      const ticket = { title, description, group_id };
  
      try {
        const response = await axios.post('http://127.0.0.1:8000/createGroupTicket', ticket, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Created the new Group ticket: ",response.data)
      
        await loadGroupTickets();

      }
       catch (error) {
        console.error('Error creating new ticket or ticket-user relation:', error);
      }
      setShowPopup(false);
    };

    const getGroups = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/groups', 
            { headers: {
                Authorization: `Bearer ${token}`,
            },
          });

          SetGroups(response.data);     
          console.log('Groups from API: ', response.data);
        
          } 
          catch (error) {
            console.error('Error getting Groups from API:', error);
          }
    };

    const loadGroupTickets = async () => {
        setTickets([]); 
        try {
            const response = await axios.get('http://127.0.0.1:8000/GroupTickets', {
                params: { group_id: currentGroup?.id }
            });
    
            console.log('Tickets from API: ', response.data);
            setTickets(response.data);
        
          } 
          catch (error) {
            console.error('Error getting Groups from API:', error);
          }
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
        getGroups();
        }, 
    []);

    useEffect(() => {
      if (currentGroup) {
          loadGroupTickets();
      }
    }, [currentGroup]);

    return(
        <div className='teams-background'>
            <HeaderCustom/>

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

            <GroupChoice currentGroup={currentGroup} groupList={Groups} SetCurrentGroup={SetCurrentGroup}/>
            
            <div className="board-wrapper">

                <div className="titles">
                    <a>Backlog</a>
                    <a>Current Sprint</a>
                    <a>In Progress</a>
                    <a>Done</a>
                </div>

                <div className='teams-main-board'>
                  <Column title="Backlog" ticketClass="backlog" tickets={tickets} loadGroupTickets={loadGroupTickets}   />
                  <Column title="Sprint" ticketClass="current_sprint" tickets={tickets} loadGroupTickets={loadGroupTickets} />
                  <Column title="InProgress" ticketClass="in_progress" tickets={tickets} loadGroupTickets={loadGroupTickets}   />
                  <Column title="Done" ticketClass="done" tickets={tickets} loadGroupTickets={loadGroupTickets}  />
                </div>

            </div>
          
            <FooterCustom/>          
        </div>
        
    )
}

export default GroupPage;