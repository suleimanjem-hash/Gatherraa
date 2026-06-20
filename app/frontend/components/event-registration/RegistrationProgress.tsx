interface Props {
  current: number;
}

const labels = ["Personal", "Ticket", "Review"];

export default function RegistrationProgress({
  current,
}: Props) {
  return (
    <div className="flex gap-4 mb-6">
      {labels.map((label, index) => (
        <div
          key={label}
          className={`flex-1 rounded p-2 text-center ${
            index <= current
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
  );
}