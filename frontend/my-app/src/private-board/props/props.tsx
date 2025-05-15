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
