"use client";

import { Table } from "@/lib/ui";

type Member = {
  id: string;
  name: string;
  role: string;
  subitems?: Member[];
};

const org: Member[] = [
  {
    id: "platform",
    name: "Platform",
    role: "Group",
    subitems: [
      {
        id: "platform-leads",
        name: "Leads",
        role: "Subgroup",
        subitems: [
          { id: "1", name: "Ada Lovelace", role: "Engineer" },
          { id: "5", name: "Barbara Liskov", role: "Lead" },
        ],
      },
      { id: "6", name: "Alan Kay", role: "Advisor" },
    ],
  },
  {
    id: "crypto",
    name: "Crypto",
    role: "Group",
    subitems: [
      { id: "2", name: "Alan Turing", role: "Research" },
      { id: "8", name: "Hedy Lamarr", role: "Engineer" },
    ],
  },
  {
    id: "compiler",
    name: "Compiler",
    role: "Group",
    subitems: [{ id: "3", name: "Grace Hopper", role: "Lead" }],
  },
];

export function TableSubrowsAutoOpen() {
  return (
    <Table
      title="Org chart"
      description="`openAutomatically` expands every node on load. Pair with `isTreeView` for nested tree lines."
      trackBy={(item) => item.id}
      data={org}
      columns={[
        { title: "Name", key: "name" },
        { title: "Role", key: "role" },
      ]}
      config={{
        locale: "en",
        columnManagement: { enabled: false },
        isTreeView: true,
        subrow: {
          openAutomatically: true,
          button: true,
          selector: "subitems",
        },
      }}
    />
  );
}
