"use client";

import { useState } from "react";
import { Input, Typography, Wizard } from "@/lib/ui";

const { Paragraph } = Typography;

type Form = { name: string; email: string };

function NameFields({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (value: string) => void;
  errors?: Partial<Form>;
}) {
  return (
    <Input
      placeholder="Full name"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      validation={{ text: errors?.name }}
    />
  );
}

function EmailFields({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (value: string) => void;
  errors?: Partial<Form>;
}) {
  return (
    <Input
      placeholder="Work email"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      validation={{ text: errors?.email }}
    />
  );
}

export function WizardValidation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Form>>({ name: "", email: "" });

  return (
    <Wizard
      name="docs-wizard-validation"
      title="Create account"
      description="Each step must be valid before Next."
      data={{ get: form, set: setForm }}
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      validation={{
        data: { name: form.name ?? "", email: form.email ?? "" },
        rules: [
          {
            key: "name",
            step: 1,
            shape: [{ type: "required", message: "Name is required." }],
          },
          {
            key: "email",
            step: 2,
            shape: [
              { type: "required", message: "Email is required." },
              { type: "email", message: "Enter a valid email." },
            ],
          },
        ],
      }}
      steps={[
        {
          key: "name",
          title: "Name",
          icon: "Folder",
          content: <NameFields value={form.name ?? ""} onChange={(name) => setForm((current) => ({ ...current, name }))} />,
        },
        {
          key: "email",
          title: "Email",
          icon: "Document",
          content: (
            <EmailFields value={form.email ?? ""} onChange={(email) => setForm((current) => ({ ...current, email }))} />
          ),
        },
        {
          key: "done",
          title: "Review",
          icon: "CheckCircle",
          content: <Paragraph>Account details are valid. Complete finishes the flow.</Paragraph>,
        },
      ]}
    />
  );
}
