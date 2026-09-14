"use client";

import { useState } from "react";
import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: Status;
  location: string;
  hours: number;
};

const seed: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "Active", location: "London", hours: 36 },
  { id: "2", name: "Alan Turing", role: "Research", team: "Crypto", status: "Active", location: "Manchester", hours: 32 },
  { id: "3", name: "Grace Hopper", role: "Lead", team: "Compiler", status: "Away", location: "New York", hours: 20 },
  { id: "4", name: "Katherine Johnson", role: "Analyst", team: "Flight", status: "Active", location: "West Virginia", hours: 40 },
  { id: "5", name: "Margaret Hamilton", role: "Engineer", team: "Apollo", status: "On leave", location: "Cambridge", hours: 0 },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableDnd() {
  const [people, setPeople] = useState(seed);

  return (
    <Table
      title="Priority"
      description="Drag a row to reorder. The grip pins left like the checkbox column."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name", config: { sticky: "left", width: 180 } },
        { title: "Role", key: "role", config: { width: 140 } },
        { title: "Team", key: "team", config: { width: 140 } },
        {
          title: "Status",
          key: "status",
          config: { width: 120 },
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
        { title: "Location", key: "location", config: { width: 180 } },
        { title: "Hours", key: "hours", config: { width: 96, alignContent: "right" } },
      ]}
      onDnD={setPeople}
      config={{
        locale: "en",
        columnManagement: { enabled: false },
        dnd: {
          renderItem: <Chip text="Moving row" color="blue" variant="surface" size="sm" />,
        },
      }}
    />
  );
}
