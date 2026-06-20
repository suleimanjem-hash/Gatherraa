interface Props {
  data: any;
  onChange: (key: string, value: string) => void;
}

export default function PersonalInfoStep({
  data,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      <input
        placeholder="Full Name"
        value={data.fullName}
        onChange={(e) =>
          onChange("fullName", e.target.value)
        }
      />

      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          onChange("email", e.target.value)
        }
      />

      <input
        placeholder="Phone"
        value={data.phone}
        onChange={(e) =>
          onChange("phone", e.target.value)
        }
      />
    </div>
  );
}