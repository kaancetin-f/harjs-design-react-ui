"use client";

import {
  Button,
  GridSystem,
  NotificationProvider,
  useNotification,
} from "@/lib/ui";

const { Flex } = GridSystem;

const saveAurora = () =>
  new Promise<{ name: string }>((resolve) => {
    setTimeout(() => resolve({ name: "Aurora" }), 2000);
  });

const failPipeline = () =>
  new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Pipeline failed")), 2000);
  });

function PromiseButtons() {
  const notification = useNotification();

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      <Button
        variant="outlined"
        color="teal"
        onClick={() => {
          void notification.promise(saveAurora(), {
            loading: { title: "Publishing…", message: "Deploying Sprint 24." },
            success: (data) => ({
              title: "Published",
              message: `${data.name} is live.`,
            }),
            error: { title: "Publish failed", message: "Check the pipeline." },
          });
        }}
      >
        Publish
      </Button>
      <Button
        variant="outlined"
        color="red"
        onClick={() => {
          void notification
            .promise(failPipeline(), {
              loading: {
                title: "Publishing…",
                message: "Deploying Sprint 24.",
              },
              success: { title: "Published", message: "Sprint 24 is live." },
              error: {
                title: "Publish failed",
                message: "Check the pipeline.",
              },
            })
            .catch(() => undefined);
        }}
      >
        Fail Publish
      </Button>
    </Flex>
  );
}

export function NotificationPromise() {
  return (
    <NotificationProvider>
      <PromiseButtons />
    </NotificationProvider>
  );
}
