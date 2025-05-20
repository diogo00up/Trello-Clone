export type groupProps = {
    id: number;
    group_name: string;
  };
  
export type GroupChoiceProps = {
    currentGroup?: groupProps;
    groupList: groupProps[];
    SetCurrentGroup: React.Dispatch<React.SetStateAction<groupProps | undefined>>;
};

export type TicketProps = {
    id: number;   
    title: string;
    description: string;
    ticket_owner : number;
    ticket_class: string;
    group_id : number;  
    date_deliver: string; 
    loadGroupTickets: () => void;
};

export type ColumnProps = {
    title: string;
    ticketClass: string;
    tickets: TicketProps[];  
    loadGroupTickets: () => void;
};

export type MembersInGroupProps = {
    id : number;
    username : string;
    group_id : number;
    is_admin : boolean;
}

export type MembersNotInGroupProps = {
  id : number;
  username : string;
}