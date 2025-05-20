import '../styles/board.css';
import {useDroppable} from '@dnd-kit/core';
import "react-datepicker/dist/react-datepicker.css";
import { ColumnProps } from '../props/props';
import GroupTicket from './tickets';

function Column({title, ticketClass, tickets, loadGroupTickets }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: ticketClass });
  return (
    <div className="indivual_column"  ref={setNodeRef} title={ticketClass}>
      {tickets.filter((ticket) => ticket.ticket_class === ticketClass).map((ticket) => {

        return (
          <GroupTicket key={ticket.id} id={ticket.id} title={ticket.title} description={ticket.description} ticket_owner={ticket.ticket_owner} ticket_class={ticket.ticket_class} group_id={ticket.group_id} date_deliver={ticket.date_deliver} loadGroupTickets={loadGroupTickets}/>
        );
        })}
    </div>
  );
}

export default Column;