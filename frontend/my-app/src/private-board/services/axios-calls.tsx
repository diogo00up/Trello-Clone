import axios from 'axios';
import { TicketProps } from '../props/props';

const API = 'http://127.0.0.1:8000';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
});

export const createTicket = async (title: string, description: string) => {
  const response = await axios.post(`${API}/createTicket`, { title, description }, authHeader());
  return response.data;
};

export const linkTicketToUser = async (user_id: number, ticket_id: number) => {
  await axios.post(`${API}/createTicketUserRelation`, { user_id, ticket_id }, authHeader());
};

export const updateTicket = async (ticket_id: number, ticket_class: string) => {
  const response = await axios.put(`${API}/updatedtickets`, { ticket_id, ticket_class }, authHeader());
  return response.data;
};

export const ticketLoad = async () => {
  const response = await axios.get(`${API}/loadTickets`, authHeader());
   return response.data.tickets.map((ticket: any) => ({
    id: ticket.id,
    title: ticket.title,
    text: ticket.description,
    ticket_class: ticket.ticket_class,
  }));
};

