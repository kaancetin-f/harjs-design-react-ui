"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: Status;
  hours: number;
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "Active", hours: 36 },
  { id: "2", name: "Alan Turing", role: "Research", team: "Crypto", status: "Active", hours: 32 },
  { id: "3", name: "Grace Hopper", role: "Lead", team: "Compiler", status: "Away", hours: 20 },
  { id: "4", name: "Katherine Johnson", role: "Analyst", team: "Flight", status: "Active", hours: 40 },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableGroups() {
  return (
    <Table
      title="Roster"
      description="Consecutive columns that share `group.title` merge into one header band."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name", group: { title: "Identity", color: "blue", align: "left" } },
        { title: "Role", key: "role", group: { title: "Identity", color: "blue", align: "left" } },
        { title: "Team", key: "team", group: { title: "Assignment", color: "purple" } },
        {
          title: "Status",
          key: "status",
          group: { title: "Assignment", color: "purple" },
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
        {
          title: "Hours",
          key: "hours",
          group: { title: "Capacity", color: "teal" },
          config: { alignContent: "right" },
        },
      ]}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
