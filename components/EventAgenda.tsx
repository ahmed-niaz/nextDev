const EventAgenda = ({ agendaList }: { agendaList: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaList.map((agenda) => (
          <li key={agenda}>{agenda}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventAgenda;
