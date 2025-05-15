
import '../styles/board.css';
import Ticket from './tickets';
import {useDroppable } from '@dnd-kit/core';
import { ColumnProps} from '../props/props'

function Column({ title, ticketClass, tickets, handleTicketLoad }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: ticketClass });

  return (
    <div className="indivual_column" ref={setNodeRef} title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket, index) => (
          <Ticket key={ticket.id} id={ticket.id} title={ticket.title} text={ticket.text} ticket_class={ticket.ticket_class}  handleTicketLoad={handleTicketLoad} />))}
    </div>
  );
}

export default Column;