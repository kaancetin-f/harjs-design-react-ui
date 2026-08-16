"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away";

type Member = {
  id: string;
  name: string;
  role: string;
  status: Status;
  subitems?: Member[];
};

const teams: Member[] = [
  {
    id: "platform",
    name: "Platform",
    role: "Group",
    status: "Active",
    subitems: [
      { id: "1", name: "Ada Lovelace", role: "Engineer", status: "Active" },
      { id: "5", name: "Barbara Liskov", role: "Lead", status: "Active" },
    ],
  },
  {
    id: "crypto",
    name: "Crypto",
    role: "Group",
    status: "Active",
    subitems: [
      { id: "2", name: "Alan Turing", role: "Research", status: "Active" },
      { id: "8", name: "Hedy Lamarr", role: "Engineer", status: "Away" },
    ],
  },
  {
    id: "compiler",
    name: "Compiler",
    role: "Group",
    status: "Away",
    subitems: [{ id: "3", name: "Grace Hopper", role: "Lead", status: "Away" }],
  },
];

const statusColor: Record<Status, "green" | "orange"> = {
  Active: "green",
  Away: "orange",
};

export function TableSubrows() {
  return (
    <Table
      title="Org"
      description="Nested `subitems` expand in place. `config.subrow.button` shows the toggle."
      trackBy={(item) => item.id}
      data={teams}
      columns={[
        { title: "Name", key: "name" },
        { title: "Role", key: "role" },
        {
          title: "Status",
          key: "status",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
      ]}
      config={{
        locale: "en",
        columnManagement: { enabled: false },
        subrow: { button: true, selector: "subitems" },
      }}
    />
  );
}
