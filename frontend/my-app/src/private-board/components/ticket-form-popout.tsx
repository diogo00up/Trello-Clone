import { TicketFormProps } from "../props/props";

export function TicketFormPopOuT({ title, setTitle, description, setDescription, setShowPopup,handleCreateTicket,}: TicketFormProps) {

  return (
    <div className="pop-put-new-ticket">
      <label htmlFor="title">New ticket title:</label>
      <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label htmlFor="new-ticket-description">New ticket description:</label>
      <input type="text" id="new-ticket-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleCreateTicket}>Submit Ticket</button>
      <button onClick={() => setShowPopup(false)}>Cancel</button>
    </div>
  );
}
