interface Props {
  step: number;
  lastStep: number;
  next: () => void;
  back: () => void;
}

export default function NavigationButtons({
  step,
  lastStep,
  next,
  back,
}: Props) {
  return (
    <div className="flex justify-between mt-8">
      {step > 0 && (
        <button onClick={back}>
          Previous
        </button>
      )}

      <button onClick={next}>
        {step === lastStep ? "Submit" : "Next"}
      </button>
    </div>
  );
}