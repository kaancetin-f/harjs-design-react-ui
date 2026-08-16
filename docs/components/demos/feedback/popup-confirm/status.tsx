"use client";

import { useState } from "react";
import { Button, GridSystem, PopupConfirm } from "@/lib/ui";

const { Flex } = GridSystem;

const statuses = [
  { status: "success", color: "green", label: "Success" },
  { status: "save", color: "green", label: "Save" },
  { status: "warning", color: "orange", label: "Warning" },
  { status: "information", color: "cyan", label: "Information" },
  { status: "error", color: "red", label: "Error" },
  { status: "delete", color: "red", label: "Delete" },
] as const;

export function PopupConfirmStatus() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] =
    useState<(typeof statuses)[number]["status"]>("success");

  return (
    <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
      {statuses.map((item) => (
        <Button
          key={item.status}
          variant="outlined"
          color={item.color}
          onClick={() => {
            setStatus(item.status);
            setOpen(true);
          }}
        >
          {item.label}
        </Button>
      ))}
      <PopupConfirm
        isOpen={open}
        title={`${status[0].toUpperCase()}${status.slice(1)}`}
        message="The confirm control uses the status color. Cancel stays outlined gray."
        status={status}
        buttons={{ cancel: {} }}
        onConfirm={() => setOpen(false)}
      />
    </Flex>
  );
}
