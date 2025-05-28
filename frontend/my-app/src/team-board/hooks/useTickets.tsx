import { useState} from 'react';
import { updateTicket,createTicket,retrieveGroups,loadTickets,getUserRole,getAllUsers,getNotGroupMember,updatedUserGroupRelation,createUserGroupRelation,deleteUserGroupRelation } from '../services/axios-calls';
import { groupProps,TicketProps,MembersInGroupProps,MembersNotInGroupProps } from '../props/props';

export function useTicket(){

    const [Groups, SetGroups] = useState<groupProps[]>([]);
    const [currentGroup, SetCurrentGroup] = useState<groupProps>();
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('New title');
    const [description, setDescription] = useState<string>('Insert new text');
    const [isAdmin, setIsAdmin] = useState<number>(0);
    const [showAdminSettings, setAdminSettings] = useState<boolean>(false);
    const [GroupMembers, SetGroupMembers] = useState<MembersInGroupProps[]>([]);
    const [NotGroupMember, SetNotGroupMembers] = useState<MembersNotInGroupProps[]>([]);
    const [activeId, setActiveId] = useState<number| null>(null);
   
    const activeTicket = tickets.find((t) => t.id === activeId);
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
        const response = await createTicket(ticket);
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
          const response = await retrieveGroups();
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
          const group_id =  currentGroup?.id 
          const response = await loadTickets(group_id);
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
          const response = await getUserRole(currentGroup?.id);
          console.log('Response about current User Role: ', response.data[0].is_admin);
          setIsAdmin(response.data[0].is_admin);
        } 
        catch (error) {
          console.error('Error fetching role:', error);
        }
    };

    const adminSettingsClick = async () => {
      if(!isAdmin){
        alert("Error! You are not an administrator.");
        return;
      }
      else{
        setAdminSettings(true);
        try {
          const response = await getAllUsers(currentGroup?.id);
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
          const response = await getNotGroupMember(memberIds);
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
        const response = await updatedUserGroupRelation(adminId,group_id,newStatus);
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
  
        const response = await createUserGroupRelation(user_id,group_id);
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

        const response = await deleteUserGroupRelation(user_id,group_id);

        
        console.log(response.data);
        adminSettingsClick();
  
        
      } 
      catch (error) {
        console.error('Error deleting usergroup relation', error);
      }
      
    };

    return{
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
 
    };
}