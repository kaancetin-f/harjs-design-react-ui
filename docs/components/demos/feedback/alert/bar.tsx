"use client";

import { Alert, GridSystem } from "@/lib/ui";

const { Flex } = GridSystem;

export function AlertBar() {
  return (
    <Flex flexDirection="column" gap="var(--space-12)" width="100%">
      <Alert
        status="information"
        message="config.bar true puts a 3px start rail on the default surface."
        config={{ bar: true }}
      />
      <Alert
        status="success"
        message="side end. The rail follows writing direction."
        config={{ bar: { side: "end" } }}
      />
      <Alert
        status="warning"
        message="side top, size 4. Thicker than the default stroke-3 rail."
        config={{ bar: { side: "top", size: "4" } }}
      />
      <Alert
        status="danger"
        message="side bottom, size 2. Pair any side with a stroke token."
        config={{ bar: { side: "bottom", size: "2" } }}
      />
    </Flex>
  );
}
