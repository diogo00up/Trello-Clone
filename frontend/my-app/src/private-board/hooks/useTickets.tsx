import { useState} from 'react';
import {TicketProps} from '../props/props';
import { createTicket, linkTicketToUser,updateTicket,ticketLoad } from '../services/axios-calls';


export function useTickets(){

    const [title, setTitle] = useState<string>('New title');
    const [description, setDescription] = useState<string>('Insert new text');
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const handleCreateTicket = async () => {
        try {
          const response = await createTicket(title,description);
          await linkTicketToUser(response.owner_id, response.ticket_id);
          await handleTicketLoad();
        }
        catch (error) {
            console.error('Error creating new ticket or ticket-user relation:', error);
        }
        setShowPopup(false);
    };
    
    const updateTicketAfterDrag = async (ticket_id: number, ticket_class: string) => {
        try {
          const response = await updateTicket(ticket_id,ticket_class);
          console.log('Ticket class updated:', response);
        } 
        catch (error) {
          console.error('Error updating ticket class:', error);
        }
    };
    
    const handleTicketLoad = async () => {
        try {
        const response = await ticketLoad();
        setTickets(response);
        console.log("Sucesfull ticket load",response)
        } 
        catch (error) {
        console.error('Failed ticket load:', error);
        }
    };
    
    return {
        tickets,
        setTickets,
        title,
        setTitle,
        description,
        setDescription,
        showPopup,
        setShowPopup,
        handleTicketLoad,
        handleCreateTicket,
        updateTicketAfterDrag,
    };
}

