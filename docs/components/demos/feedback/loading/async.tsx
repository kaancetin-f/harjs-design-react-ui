"use client";

import { Button, LoadingProvider, useLoading } from "@/lib/ui";

const saveAurora = () =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, 2000);
  });

function SaveButton() {
  // hooks
  const { isLoading, setIsLoading } = useLoading();

  // methods
  async function save() {
    setIsLoading(true);
    try {
      await saveAurora();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button color="orange" onClick={() => void save()} disabled={isLoading}>
      Save
    </Button>
  );
}

export function LoadingAsync() {
  return (
    <LoadingProvider>
      <SaveButton />
    </LoadingProvider>
  );
}

LoadingAsync.displayName = "LoadingAsync";

