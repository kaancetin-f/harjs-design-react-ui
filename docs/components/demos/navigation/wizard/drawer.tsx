"use client";

import { useState } from "react";
import { Button, Typography, Wizard } from "@/lib/ui";

const { Paragraph } = Typography;

type Form = { team: string };

export function WizardDrawer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Form>>({ team: "" });

  return (
    <>
      <Button variant="outlined" color="cyan" onClick={() => setOpen(true)}>
        Open wizard
      </Button>
      <Wizard.Drawer
        name="docs-wizard-drawer"
        title="Invite team"
        description="Sidebar stacks above the panel on small screens."
        size="4xl"
        data={{ get: form, set: setForm }}
        currentStep={step}
        onChange={setStep}
        onCompleted={() => {
          setStep(0);
          setOpen(false);
        }}
        open={{ get: open, set: setOpen }}
        config={{ locale: "en", freeContent: true }}
        steps={[
          {
            key: "people",
            title: "People",
            icon: "Folder",
            content: <Paragraph>Pass config.freeContent so Drawer padding does not wrap the chrome.</Paragraph>,
          },
          {
            key: "role",
            title: "Role",
            icon: "Document",
            content: <Paragraph>Complete resets the uncontrolled index and clears session storage.</Paragraph>,
          },
        ]}
      />
    </>
  );
}
