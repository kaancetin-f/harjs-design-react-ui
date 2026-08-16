"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: Status;
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "Active" },
  { id: "2", name: "Alan Turing", role: "Research", team: "Crypto", status: "Active" },
  { id: "3", name: "Grace Hopper", role: "Lead", team: "Compiler", status: "Away" },
  { id: "4", name: "Katherine Johnson", role: "Analyst", team: "Flight", status: "Active" },
  { id: "5", name: "Margaret Hamilton", role: "Engineer", team: "Apollo", status: "On leave" },
  { id: "6", name: "Donald Knuth", role: "Research", team: "Typesetting", status: "Active" },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableSearchable() {
  return (
    <Table
      title="Team"
      description="Type in a column to filter. Operators live in the filter menu."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name", filterDataType: "string" },
        { title: "Role", key: "role", filterDataType: "string" },
        { title: "Team", key: "team", filterDataType: "string" },
        {
          title: "Status",
          key: "status",
          filterDataType: "string",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
      ]}
      config={{ locale: "en", isSearchable: true, columnManagement: { enabled: false } }}
    />
  );
}
