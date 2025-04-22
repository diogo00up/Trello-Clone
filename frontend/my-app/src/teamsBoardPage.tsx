import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './teamsBoardPage.css';
import FooterCustom from './footer/footer';
import HeaderCustom from './header/header';

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
    text: string;
    ticket_owner : number;
    ticket_class: string;
    group_id : number;  
};

type ColumnProps = {
    title: string;
    ticketClass: string;
    tickets: TicketProps[];  
};

function Column({ title, ticketClass, tickets }: ColumnProps) {

  return (
    <div className="indivual_column" title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket, index) => 
        (<GroupTicket id={ticket.id} title={ticket.title} text={ticket.text} ticket_owner={ticket.ticket_owner} ticket_class={ticket.ticket_class} group_id={ticket.group_id} />))}
    </div>
  );
}

function GroupTicket({id, title, text,ticket_owner, ticket_class, group_id}: TicketProps){
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedText, setEditedText] = useState(text); 
    const token = sessionStorage.getItem('access_token');
    const [isEditing, setIsEditing] = useState(false); 

    return (
        <div className="ticketbox">
    
         
          <div className="ticketTitle"  onPointerDown={(e) => e.stopPropagation()}>
              {isEditing ? ( <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>) : (<input type="text" value={editedTitle} readOnly onClick={() => setIsEditing(true)} />)}
          </div>
    
          <div className="tickerText" onPointerDown={(e) => e.stopPropagation()}>
            {isEditing ? ( <textarea value={editedText}  onChange={(e) => setEditedText(e.target.value)} /> ) : (<textarea value={editedText} readOnly onClick={() => setIsEditing(true)} />)}
          </div>
          
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

    const getGroups = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/groups', { 
            });

            SetGroups(response.data);     
            console.log('Groups from API: ', response.data);
        
          } 
          catch (error) {
            console.error('Error getting Groups from API:', error);
          }
    };

    const loadGroupTickets = async () => {
        
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

    useEffect(() => {
        getGroups();
        }, 
    []);

    return(
        <div className='teams-background'>
            <HeaderCustom/>
            <GroupChoice currentGroup={currentGroup} groupList={Groups} SetCurrentGroup={SetCurrentGroup}/>
            <button onClick={loadGroupTickets}> ola </button>

            <div className="board-wrapper">
                <div className="titles">
                    <a>Backlog</a>
                    <a>Current Sprint</a>
                    <a>In Progress</a>
                    <a>Done</a>
                </div>
                
                <div className='teams-main-board'>
                    <Column title="Backlog" ticketClass="backlog" tickets={tickets}   />
                    <Column title="Sprint" ticketClass="current_sprint" tickets={tickets}  />
                    <Column title="InProgress" ticketClass="in_progress" tickets={tickets}   />
                    <Column title="Done" ticketClass="done" tickets={tickets}  />
                </div>

            </div>
          
            <FooterCustom/>
            
        </div>
        
    )
}

export default GroupPage;