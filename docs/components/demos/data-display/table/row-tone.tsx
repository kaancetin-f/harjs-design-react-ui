"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  status: Status;
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", status: "Active" },
  { id: "2", name: "Alan Turing", role: "Research", status: "Active" },
  { id: "3", name: "Grace Hopper", role: "Lead", status: "Away" },
  { id: "4", name: "Katherine Johnson", role: "Analyst", status: "Active" },
  { id: "5", name: "Margaret Hamilton", role: "Engineer", status: "On leave" },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

const rowTone: Record<Status, string> = {
  Active: "transparent",
  Away: "color-mix(in srgb, var(--orange-400) 10%, transparent)",
  "On leave": "color-mix(in srgb, var(--gray-500) 10%, transparent)",
};

export function TableRowTone() {
  return (
    <Table
      title="Team"
      description="`rowBackgroundColor` tints the whole row from the item."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name" },
        { title: "Role", key: "role" },
        {
          title: "Status",
          key: "status",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
      ]}
      rowBackgroundColor={(item) => rowTone[item.status]}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
