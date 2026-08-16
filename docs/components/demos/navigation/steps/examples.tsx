"use client";

import { useState, type ReactNode } from "react";
import { Steps, Typography, GridSystem, Icon } from "@/lib/ui";

const { Paragraph, Title } = Typography;
const { Flex } = GridSystem;

export function StepsVertical() {
  const [step, setStep] = useState(1);

  return (
    <Steps
      name="docs-steps-vertical"
      currentStep={step}
      onChange={setStep}
      variant="vertical"
      config={{ locale: "en" }}
      steps={[
        {
          key: "account",
          title: "Account",
          content: <Paragraph>The track sits on the left. Completed steps show a green check.</Paragraph>,
        },
        {
          key: "company",
          title: "Company",
          content: <Paragraph>The current step is a numbered badge. Pass theme to change the colors.</Paragraph>,
        },
        {
          key: "review",
          title: "Review",
          content: <Paragraph>Below 640px the track stacks above the panel.</Paragraph>,
        },
      ]}
    />
  );
}

export function StepsKeyboard() {
  const [step, setStep] = useState(1);

  return (
    <Steps
      name="docs-steps-keyboard"
      currentStep={step}
      onChange={setStep}
      config={{ locale: "en" }}
      steps={[
        {
          key: "start",
          title: "Start",
          content: <Paragraph>Tab to a completed step and press Enter or Space to go back.</Paragraph>,
        },
        {
          key: "current",
          title: "Current",
          content: <Paragraph>The current step has aria-current=&quot;step&quot;.</Paragraph>,
        },
        {
          key: "later",
          title: "Later",
          content: <Paragraph>Without validation, future steps stay reachable from the track.</Paragraph>,
        },
      ]}
    />
  );
}

export function StepsResponsive() {
  const [step, setStep] = useState(2);

  return (
    <Steps
      name="docs-steps-responsive"
      currentStep={step}
      onChange={setStep}
      config={{
        locale: "en",
        header: true,
        theme: { current: "var(--blue-800)", completed: "var(--green-500)" },
      }}
      steps={[
        {
          key: "account",
          title: "Account",
          icon: "Folder",
          content: (
            <StepSplit
              heading="Workspace"
              description="Name the workspace and choose a region."
            >
              <Paragraph>Account details stay in this column on wide panes.</Paragraph>
            </StepSplit>
          ),
        },
        {
          key: "details",
          title: "Details",
          icon: "Document",
          content: (
            <StepSplit
              heading="Company"
              description="Add billing profile and contact email."
            >
              <Paragraph>The form sits in the wider column on the right.</Paragraph>
            </StepSplit>
          ),
        },
        {
          key: "payment",
          title: "Payment",
          icon: "CreditCard",
          content: (
            <StepSplit
              heading="Payment Method"
              description="Select the payment method you would like"
            >
              <Flex flexDirection="column" gap="var(--space-12)">
                <Flex alignItems="center" gap="var(--space-8)">
                  <Icon icon="CreditCard" size={18} fill="var(--blue-800)" />
                  <Paragraph>Card</Paragraph>
                </Flex>
                <Flex alignItems="center" gap="var(--space-8)">
                  <Icon icon="Inbox-Fill" size={18} fill="var(--gray-500)" />
                  <Paragraph color="gray-500">Bank transfer</Paragraph>
                </Flex>
              </Flex>
            </StepSplit>
          ),
        },
      ]}
    />
  );
}

function StepSplit({
  heading,
  description,
  children,
}: {
  heading: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Flex flexWrap="wrap" alignItems="flex-start" gap="var(--space-24)" width="100%">
      <Flex flexDirection="column" gap="var(--space-8)" flex="1 1 12rem">
        <Title size="md">{heading}</Title>
        <Paragraph color="gray-500">{description}</Paragraph>
      </Flex>
      <Flex flexDirection="column" gap="var(--space-12)" flex="2 1 18rem">
        {children}
      </Flex>
    </Flex>
  );
}
