"use client";

import { Button, GridSystem, NotificationProvider, useNotification } from "@/lib/ui";

const { Flex } = GridSystem;

function HookButtons() {
  const notification = useNotification();

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      <Button
        variant="outlined"
        color="teal"
        onClick={() => {
          notification.success("Aurora is live", {
            message: "Sprint 24 shipped to production.",
          });
        }}
      >
        Success
      </Button>
      <Button
        variant="outlined"
        color="red"
        onClick={() => {
          notification.error("Publish failed", {
            message: "Check the pipeline.",
          });
        }}
      >
        Error
      </Button>
      <Button
        variant="outlined"
        color="orange"
        onClick={() => {
          notification.warning("Contracts drifted");
        }}
      >
        Warning
      </Button>
    </Flex>
  );
}

export function NotificationHook() {
  return (
    <NotificationProvider>
      <HookButtons />
    </NotificationProvider>
  );
}
