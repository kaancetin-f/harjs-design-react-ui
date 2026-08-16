"use client";

import { Button, GridSystem, LoadingProvider, useLoading } from "@/lib/ui";

const { Flex } = GridSystem;

function Trigger() {
  // hooks
  const { isLoading, setIsLoading } = useLoading();

  // methods
  function show() {
    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 1600);
  }

  return (
    <Flex alignItems="center" gap="var(--space-12)">
      <Button variant="outlined" color="orange" onClick={show} disabled={isLoading}>
        Show loading
      </Button>
    </Flex>
  );
}

export function LoadingHook() {
  return (
    <LoadingProvider>
      <Trigger />
    </LoadingProvider>
  );
}

LoadingHook.displayName = "LoadingHook";

