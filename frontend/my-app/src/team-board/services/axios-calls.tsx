import axios from 'axios';

const API = 'http://127.0.0.1:8000';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
});

export const updateTicket = async (ticket_id: number, ticket_class: string)  => {
   const response = await axios.put(`${API}/updatedGroupTickets`, { ticket_id,ticket_class}, authHeader());
   return response;
};
