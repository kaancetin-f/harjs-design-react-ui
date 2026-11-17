"use client";

import { useState } from "react";
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

export function TableRowClick() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = people.find((person) => person.id === selectedId);

  return (
    <Table
      title="Team"
      description={selected ? `Opened ${selected.name}.` : "Click a row, or focus it and press Enter."}
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
      onRowClick={(item) => setSelectedId(item.id)}
      rowBackgroundColor={(item) =>
        item.id === selectedId ? "color-mix(in srgb, var(--blue-500) 12%, transparent)" : "transparent"
      }
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
