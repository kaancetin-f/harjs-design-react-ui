"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: Status;
  location: string;
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "Active", location: "London" },
  { id: "2", name: "Alan Turing", role: "Research", team: "Crypto", status: "Active", location: "Manchester" },
  { id: "3", name: "Grace Hopper", role: "Lead", team: "Compiler", status: "Away", location: "New York" },
  { id: "4", name: "Katherine Johnson", role: "Analyst", team: "Flight", status: "Active", location: "West Virginia" },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableColumns() {
  return (
    <Table
      title="Team"
      description="Manage Columns toggles visibility, order, and PDF export. Layout is stored per `storageKey`."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name" },
        { title: "Role", key: "role" },
        { title: "Team", key: "team" },
        {
          title: "Status",
          key: "status",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
        { title: "Location", key: "location" },
      ]}
      config={{
        locale: "en",
        columnManagement: { enabled: true, storageKey: "docs-table-columns", pdfExport: false },
      }}
    />
  );
}
