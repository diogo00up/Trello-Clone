import { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/board.css';
import FooterCustom from '../../footer/footer';
import HeaderCustom from '../../header/header-other';
import add_plus from '../../icons/plus-circle.svg';
import close from '../../icons/x.svg'
import tool from '../../icons/tool.svg'
import { DndContext, DragOverlay } from '@dnd-kit/core';
import "react-datepicker/dist/react-datepicker.css";
import { groupProps,GroupChoiceProps,TicketProps,MembersInGroupProps,MembersNotInGroupProps } from '../props/props';
import Column from './column';
import GroupTicket from './tickets';
import GroupChoice from './group-choice';
import { updateTicket } from '../services/axios-calls';

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
        const response = await updateTicket(ticket_id,ticket_class);
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
    
      console.log("IDSSSSSSSSSSSSSSS",memberIds);
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


    const kickMember = async (user_id: number, group_id : number) => {
      
      console.log("KICK MEMBER");
      console.log(user_id);
      console.log(group_id);

      if (!window.confirm("Are you sure you want to kick this member?")) return;

      try {

        const response = await axios.delete('http://127.0.0.1:8000/deleteUserGroupRelation', {
  
          headers: {
            Authorization: `Bearer ${token}`,
          },
  
          data: { user_id, group_id  }  

        });

        
        console.log(response.data);
        adminSettingsClick();
  
        
      } 
      catch (error) {
        console.error('Error deleting usergroup relation', error);
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

                          {currentGroup?.id !== undefined && (
                          <a className='kick-member' onClick={() => kickMember(member.id, currentGroup.id)}>Kick member</a>
                          )}

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