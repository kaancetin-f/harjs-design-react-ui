"use client";

import { useState } from "react";
import { Input, Steps } from "@/lib/ui";

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

export function StepsValidation() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ name: "", email: "" });

  return (
    <Steps
      name="docs-steps-validation"
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      validation={{
        data: form,
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
          content: (
            <NameFields
              value={form.name}
              onChange={(name) => setForm((current) => ({ ...current, name }))}
            />
          ),
        },
        {
          key: "email",
          title: "Email",
          content: (
            <EmailFields
              value={form.email}
              onChange={(email) => setForm((current) => ({ ...current, email }))}
            />
          ),
        },
        {
          key: "done",
          title: "Done",
          content: <p>Account details are valid.</p>,
        },
      ]}
    />
  );
}
