import { useEffect,useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/board.css';
import FooterCustom from '../../footer/footer';
import HeaderCustom from '../../header/header-other';
import add_plus from '../../icons/plus-circle.svg';
import close from '../../icons/x.svg'
import tool from '../../icons/tool.svg'
import { DndContext, DragOverlay } from '@dnd-kit/core';
import "react-datepicker/dist/react-datepicker.css";
import Column from './column';
import GroupTicket from './tickets';
import GroupChoice from './group-choice';
import { useTicket } from '../hooks/useTickets';

function GroupPage(){

  const {
    updateTicketAfterDrag,
    handleButtonClick,
    getGroups,
    loadAdminSetting,
    retrieveNotInGroupMembers,
    handleToggleAdmin,
    enviteMember,
    kickMember,
    tickets,
    setTickets,
    GroupMembers,
    currentGroup,
    loadGroupTickets,   
    setAdminSettings,
    showAdminSettings,
    showPopup,
    setShowPopup,
    title,
    setTitle,
    description,
    setDescription,
    NotGroupMember,
    isAdmin,
    adminSettingsClick,
    Groups,
    SetCurrentGroup,
    activeTicket,
    activeId,
    setActiveId,
    } = useTicket();
    
    const AdminSettingsRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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