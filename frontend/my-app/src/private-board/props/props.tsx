export type TicketProps = {
  id: string;   
  title: string;
  text: string;
  ticket_class: string;
  handleTicketLoad: () => void;
};

export type ColumnProps = {
  title: string;
  ticketClass: string;
  tickets: TicketProps[];
  handleTicketLoad: () => void;
};

export type TicketFormProps = {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  setShowPopup: (val: boolean) => void;
  handleCreateTicket: () => void;
}
