interface Props {
  data: any;
  onChange: (key: string, value: string) => void;
}

export default function TicketSelectionStep({
  data,
  onChange,
}: Props) {
  return (
    <select
      value={data.ticketType}
      onChange={(e) =>
        onChange("ticketType", e.target.value)
      }
    >
      <option value="">Choose Ticket</option>
      <option value="General">General</option>
      <option value="VIP">VIP</option>
    </select>
  );
}