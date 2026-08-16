"use client";

import { useState } from "react";
import { Typography, Wizard } from "@/lib/ui";

const { Paragraph } = Typography;

type Form = { company: string };

export function WizardBasic() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Form>>({ company: "" });

  return (
    <Wizard
      name="docs-wizard-basic"
      title="Onboarding"
      description="Create the workspace, then invite the team."
      data={{ get: form, set: setForm }}
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      steps={[
        {
          key: "account",
          title: "Account",
          icon: "Folder",
          content: <Paragraph>The sidebar is the flow name. This header is the current step.</Paragraph>,
        },
        {
          key: "company",
          title: "Company",
          icon: "Document",
          content: (
            <Paragraph>
              Completed steps in the sidebar are clickable. Future steps stay locked when validation is on.
            </Paragraph>
          ),
        },
        {
          key: "done",
          title: "Review",
          icon: "CheckCircle",
          content: <Paragraph>Complete clears session storage and resets an uncontrolled wizard.</Paragraph>,
        },
      ]}
    />
  );
}
