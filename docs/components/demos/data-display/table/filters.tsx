"use client";

import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  status: Status;
  billable: boolean;
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", status: "Active", billable: true },
  { id: "2", name: "Alan Turing", role: "Research", status: "Active", billable: true },
  { id: "3", name: "Grace Hopper", role: "Lead", status: "Away", billable: false },
  { id: "4", name: "Katherine Johnson", role: "Analyst", status: "Active", billable: true },
  { id: "5", name: "Margaret Hamilton", role: "Engineer", status: "On leave", billable: false },
  { id: "6", name: "Donald Knuth", role: "Research", status: "Active", billable: true },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableFilters() {
  return (
    <Table
      title="Assignments"
      description="Status uses a preset list. Billable uses a boolean filter."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name", filterDataType: "string" },
        { title: "Role", key: "role", filterDataType: "string" },
        {
          title: "Status",
          key: "status",
          filterDataType: "string",
          filters: [
            { value: "Active", text: "Active" },
            { value: "Away", text: "Away" },
            { value: "On leave", text: "On leave" },
          ],
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
        { title: "Billable", key: "billable", filterDataType: "boolean" },
      ]}
      config={{ locale: "en", isSearchable: true, columnManagement: { enabled: false } }}
    />
  );
}
