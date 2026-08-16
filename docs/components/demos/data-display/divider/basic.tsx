"use client";

import { Divider, GridSystem, Typography } from "@/lib/ui";

const { Flex } = GridSystem;
const { Paragraph } = Typography;

export function DividerBasic() {
  return (
    <Flex flexDirection="column" width="100%">
      <Paragraph>Drafts sit above the fold until they are ready to ship.</Paragraph>
      <Divider />
      <Paragraph>Published notes land here after review.</Paragraph>
      <Divider>or</Divider>
      <Paragraph>Archive anything that should leave the active list.</Paragraph>
    </Flex>
  );
}
