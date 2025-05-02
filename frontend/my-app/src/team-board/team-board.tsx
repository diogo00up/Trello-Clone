import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './team-board.css';
import FooterCustom from '../footer/footer';
import HeaderCustom from '../header/header-other';
import add_plus from '../icons/plus-circle.svg';
import settings from '../icons/settings.svg';
import log_out from '../icons/log-out.svg'
import google from '../icons/google.svg'
import close from '../icons/x.svg'
import back from '../icons/back2.svg'
import tool from '../icons/tool.svg'
import calendar from '../icons/calendar1.svg'
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    date_deliver: string; 
    loadGroupTickets: () => void;
};

type ColumnProps = {
    title: string;
    ticketClass: string;
    tickets: TicketProps[];  
    loadGroupTickets: () => void;
};

type MembersInGroupProps = {
    id : number;
    username : string;
    group_id : number;
    is_admin : boolean;
}

type MembersNotInGroupProps = {
  id : number;
  username : string;
}


function Column({title, ticketClass, tickets, loadGroupTickets }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: ticketClass });
  return (
    <div className="indivual_column"  ref={setNodeRef} title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket) => {

        return (
          <GroupTicket key={ticket.id} id={ticket.id} title={ticket.title} description={ticket.description} ticket_owner={ticket.ticket_owner} ticket_class={ticket.ticket_class} group_id={ticket.group_id} date_deliver={ticket.date_deliver} loadGroupTickets={loadGroupTickets}/>
        );
        })}
    </div>
  );
}

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

    const GoogleAuth = async (date: Date | null) => {
      console.log("Goodle Auth!");
      console.log(date);
      if(date==null){
        return;
      }

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
            <img src={google} className="google-button"  onPointerDown={(e) => e.stopPropagation()}  onClick={() => GoogleAuth(new Date(ticketDate))}/>
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


function GroupChoice({ currentGroup, groupList, SetCurrentGroup }: GroupChoiceProps){
    return(

      <div className='group_choice'>
        <a id='group-choice-a'>Team: </a>
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
    const token = sessionStorage.getItem('access_token');
    const [Groups, SetGroups] = useState<groupProps[]>([]);
    const [currentGroup, SetCurrentGroup] = useState<groupProps>();
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('New title');
    const [description, setDescription] = useState<string>('Insert new text');
    const [activeId, setActiveId] = useState<number| null>(null);
    const activeTicket = tickets.find((t) => t.id === activeId);
    const [isAdmin, setIsAdmin] = useState<number>(0);
    const [showAdminSettings, setAdminSettings] = useState<boolean>(false);
    const [GroupMembers, SetGroupMembers] = useState<MembersInGroupProps[]>([]);
    const [NotGroupMember, SetNotGroupMembers] = useState<MembersNotInGroupProps[]>([]);
    const AdminSettingsRef = useRef<HTMLDivElement>(null);
    
    const navigate = useNavigate();

    const updateTicketAfterDrag = async (ticket_id: number, ticket_class: string) => {
      try {
  
        const response = await axios.put('http://127.0.0.1:8000/updatedGroupTickets', { ticket_id, ticket_class }, 
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

    const handleButtonClick = async () => {
      const group_id = currentGroup?.id;
      const ticket = { title, description, group_id };

      if (!title.trim() || !description.trim()) {
        alert("Please provide a valid title and description.");
        return;
      }
  
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
        console.error('Error creating new ticket:', error);
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

    const loadAdminSetting = async () => {
      setTickets([]); 
      try {
          const response = await axios.get('http://127.0.0.1:8000/getUserRole', {
              headers: {
                Authorization: `Bearer ${token}`,
            },
              params: { group_id: currentGroup?.id }
          });

          console.log('Response about current User Role: ', response.data[0].is_admin);
          setIsAdmin(response.data[0].is_admin);
        } 
        catch (error) {
          console.error('Error fetching role:', error);
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

    const handleDragStart = (event: any) => {
      setActiveId(event.active.id); 
    };

    const handleDragEnd = (event: any) => {
      const { active, over } = event;
      if (!over) return;
      updateTicketAfterDrag(active.id,over.id);
  
      if (active.id && over?.id) {
          const updatedTickets = tickets.map((ticket) =>
          ticket.id === active.id ? { ...ticket, ticket_class: over.id } : ticket 
        );
  
        setTickets(updatedTickets);
      }
  
      setActiveId(null);
    };
    
    const adminSettingsClick = async () => {
      if(!isAdmin){
        alert("Error! You are not an administrator.");
        return;
      }
      else{
        setAdminSettings(true);

        try {
          const response = await axios.get('http://127.0.0.1:8000/getAllUsers', {
              headers: {
                Authorization: `Bearer ${token}`,
            },
              params: { group_id: currentGroup?.id }
          });

          console.log('Response about all Users: ', response.data);
          SetGroupMembers(response.data);
     
        } 

        catch (error) {
          console.error('Error fetching all users:', error);
        }

        

      }
    
    }

    const retrieveNotInGroupMembers = async () => {
    
      const memberIds = GroupMembers.map(member => member.id);
    
       try {
          const response = await axios.post('http://127.0.0.1:8000/retriveUsersNotInGroup', memberIds ,{
     
          });

          console.log('Response about not in group Users: ', response.data);
          SetNotGroupMembers(response.data);
          
        } 

        catch (error) {
          console.error('Error fetching all users:', error);
        }

    }

    const handleToggleAdmin = async (adminId: number,group_id:number, newStatus: boolean) => {
      console.log("Toggle switch");
      console.log(adminId);
      console.log(newStatus);
      try {
  
        const response = await axios.put('http://127.0.0.1:8000/updatedUserGroup',   {
          user_id: adminId,          
          group_id: group_id,        
          is_admin: newStatus ? 1 : 0 
        }, 
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
    
       
        console.log('Admin role updated:', response.data);
        adminSettingsClick();
      } 
      catch (error) {
        console.error('Error updating admin role:', error);
      }
    };

    const enviteMember = async (user_id: number, group_id : number) => {
      console.log("ENVITE MEMBER");
      console.log(user_id);
      console.log(group_id);
      try {
  
      const response = await axios.post('http://127.0.0.1:8000/createUserGroup', { user_id, group_id }, 

        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
    
        console.log('Added user to group:', response.data);
        adminSettingsClick();
        
      } catch (error) {
        console.error('Error adding user to group:', error);
      }
      
    };

    useEffect(() => {
        getGroups();
        }, 
    []);


    useEffect(() => {
      retrieveNotInGroupMembers();
      }, 
    [GroupMembers]);

   

    useEffect(() => {
      if (!sessionStorage.getItem('access_token')) {
        navigate('/welcome');
      }
      else if (currentGroup){
          loadGroupTickets();
          loadAdminSetting();
      }
    }, [currentGroup]);

    useEffect(() => {
          function handleClickOutside(event: MouseEvent) {
            if (AdminSettingsRef.current && !AdminSettingsRef.current.contains(event.target as Node)) {
              setAdminSettings(false);
            }
          }
      
          if (showAdminSettings) {
            document.addEventListener('mousedown', handleClickOutside);
          } else {
            document.removeEventListener('mousedown', handleClickOutside);
          }
      
          return () => {
            document.removeEventListener('mousedown', handleClickOutside);
          };
        }, [showAdminSettings]);
    

    return(
        <div className='teams-background'>
            <HeaderCustom/>

            <div className='tool-bar'>

              <div className="add-ticket" onClick={() => setShowPopup(true)}>
                <img src={add_plus} className="add_plus" alt="add" />
                <span className="add-text">Create new ticket</span>
              </div>

              <div className='user-icon'>
                <img src={settings} className="add_plus" alt="add" />
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

            {showAdminSettings && (
                <div className='admin-box' ref={AdminSettingsRef}>
                    <div onClick={() => setAdminSettings(false)} id='close-admin' >
                      <img src={close} id='close-admin-x' />
                    </div>
                    
                    <h4>Group members:</h4>
                    {GroupMembers.map(member => (
                        <div key={member.id} className='admin_line-info' >
                          <a>ID: {member.id}</a>
                          <a>Username: {member.username}</a>

                          <a>IsAdmin ? 
                            <input type="checkbox" checked={member.is_admin} onChange={() => handleToggleAdmin(member.id, member.group_id, !member.is_admin)}/>
                          </a>
                          <a>Kick member</a>
                      </div>
                      ))
                    }
                    <h4>Invite Members:</h4>

                    {
                      NotGroupMember.map(notMember =>(
                        <div key={notMember.id} className='admin_line-info' >
                          <a>ID: {notMember.id}</a>
                          <a>Username: {notMember.username}</a>
                          {currentGroup?.id !== undefined && (
                          <a className='envite-member' onClick={() => enviteMember(notMember.id, currentGroup.id)}>
                            Invite Member
                          </a>
                        )}
                        </div>
                      ))
                    }
                </div>
            )}


            <div className='admin-info'>
              <a> Current role: {isAdmin == 1? "Admin" : "Member"} </a>
              <img src={tool} onClick={adminSettingsClick} className="tool-box" alt="add" />
            </div>
        
            
            <GroupChoice currentGroup={currentGroup} groupList={Groups} SetCurrentGroup={SetCurrentGroup}/>

            <div className="board-wrapper">

                <div className="titles">
                    <a>Backlog</a>
                    <a>Current Sprint</a>
                    <a>In Progress</a>
                    <a>Done</a>
                </div>

                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

                  <div className='teams-main-board'>
                    <Column title="Backlog" ticketClass="backlog" tickets={tickets} loadGroupTickets={loadGroupTickets}   />
                    <Column title="Sprint" ticketClass="current_sprint" tickets={tickets} loadGroupTickets={loadGroupTickets} />
                    <Column title="InProgress" ticketClass="in_progress" tickets={tickets} loadGroupTickets={loadGroupTickets}   />
                    <Column title="Done" ticketClass="done" tickets={tickets} loadGroupTickets={loadGroupTickets}  />
                  </div>

                  <DragOverlay>
                    {activeId && activeTicket ? (
                      <GroupTicket id={activeTicket.id} title={activeTicket.title} description={activeTicket.description} ticket_owner={activeTicket.ticket_owner} ticket_class={activeTicket.ticket_class} group_id={activeTicket.group_id} date_deliver={activeTicket.date_deliver}   loadGroupTickets={loadGroupTickets} />) : null}
                  </DragOverlay>

                </DndContext>
            
            </div>
            
            <FooterCustom/>          
        </div>
        
    )
}

export default GroupPage;