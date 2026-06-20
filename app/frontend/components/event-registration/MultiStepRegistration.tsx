import RegistrationProgress from "./RegistrationProgress";
import PersonalInfoStep from "./PersonalInfoStep";
import TicketSelectionStep from "./TicketSelectionStep";
import ReviewStep from "./ReviewStep";
import SuccessStep from "./SuccessStep";
import NavigationButtons from "./NavigationButtons";

import { useRegistrationForm } from "../../hooks/useRegistrationForm";
import { validateStep } from "../../utils/validation";
import { clearRegistration } from "../../utils/storage";

export default function MultiStepRegistration() {
  const {
    form,
    step,
    setStep,
    updateField,
  } = useRegistrationForm();

  const next = () => {
    if (!validateStep(step, form)) {
      alert("Please complete required fields");
      return;
    }

    if (step === 2) {
      clearRegistration();
      setStep(3);
      return;
    }

    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  return (
    <div className="max-w-xl mx-auto">

      {step < 3 && (
        <RegistrationProgress current={step} />
      )}

      {step === 0 && (
        <PersonalInfoStep
          data={form}
          onChange={updateField}
        />
      )}

      {step === 1 && (
        <TicketSelectionStep
          data={form}
          onChange={updateField}
        />
      )}

      {step === 2 && (
        <ReviewStep data={form} />
      )}

      {step === 3 && <SuccessStep />}

      {step < 3 && (
        <NavigationButtons
          step={step}
          lastStep={2}
          next={next}
          back={back}
        />
      )}
    </div>
  );
}