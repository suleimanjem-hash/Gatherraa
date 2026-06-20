export default function ReviewStep({
  data,
}: {
  data: any;
}) {
  return (
    <div className="space-y-2">
      <p>Name: {data.fullName}</p>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Ticket: {data.ticketType}</p>
    </div>
  );
}