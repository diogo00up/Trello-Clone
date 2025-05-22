import axios from 'axios';

const API = 'http://127.0.0.1:8000';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
});

export const updateTicket = async (ticket_id: number, ticket_class: string)  => {
   const response = await axios.put(`${API}/updatedGroupTickets`, { ticket_id,ticket_class}, authHeader());
   return response;
};

interface Ticket {
  title: string;
  description: string;
  group_id: number | undefined ;
}

export const createTicket = async (ticket: Ticket)  => {
   const response = await axios.post(`${API}/createGroupTicket`, ticket , authHeader());
   return response;
};

export const retrieveGroups = async ()  => {
   const response = await axios.get(`${API}/groups`, authHeader());
   return response;
};

export const loadTickets = async (group_id: number | undefined)  => {
   const response = await axios.get(`${API}/GroupTickets`, {
        params: { group_id },
    });
   return response;
};

export const getUserRole = async (group_id: number | undefined)  => {
    const response = await axios.get(`${API}/getUserRole`, {
        headers: authHeader().headers,
        params: { group_id }
    });
    return response;
};

export const getAllUsers = async (group_id: number | undefined)  => {
    const response = await axios.get(`${API}/getAllUsers`, {
        headers: authHeader().headers,
        params: { group_id }
    });
    return response;
};

export const getNotGroupMember = async (memberIds: Number[])  => {
   const response = await axios.post(`${API}/retriveUsersNotInGroup`, memberIds);
   return response;
};

interface Ticket {
  title: string;
  description: string;
  group_id: number | undefined ;
}

export const updatedUserGroupRelation = async (user_id: number, group_id: number,is_admin: boolean)  => {
   const response = await axios.put(`${API}/updatedUserGroup`, {user_id, group_id,is_admin}, authHeader());
   return response;
};

export const createUserGroupRelation = async (user_id:number, group_id:number)  => {
   const response = await axios.post(`${API}/createUserGroup`, {user_id, group_id} , authHeader());
   return response;
};

export const deleteUserGroupRelation = async (user_id:number, group_id:number)  => {
   const response = await axios.delete(`${API}/deleteUserGroupRelation`, {
        headers: authHeader().headers,
        data: { user_id, group_id }
    });
   return response;
};


