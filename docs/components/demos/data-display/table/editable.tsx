"use client";

import { useState } from "react";
import { Table } from "@/lib/ui";

type Person = {
  id: string;
  name: string;
  role: string;
  hours: number;
  billable: boolean;
};

const seed: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", hours: 36, billable: true },
  { id: "2", name: "Alan Turing", role: "Research", hours: 32, billable: true },
  { id: "3", name: "Grace Hopper", role: "Lead", hours: 20, billable: false },
  { id: "4", name: "Katherine Johnson", role: "Analyst", hours: 40, billable: true },
];

const roles = [
  { value: "Engineer", text: "Engineer" },
  { value: "Lead", text: "Lead" },
  { value: "Analyst", text: "Analyst" },
  { value: "Research", text: "Research" },
];

export function TableEditable() {
  const [people, setPeople] = useState(seed);

  return (
    <Table
      title="Timesheet"
      description="Edit a cell and `onEditable` writes the row back into state."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        {
          title: "Name",
          key: "name",
          editable: () => ({ type: "string" }),
        },
        {
          title: "Role",
          key: "role",
          editable: () => ({ type: "single-select", options: roles }),
        },
        {
          title: "Hours",
          key: "hours",
          config: { alignContent: "right", width: 96 },
          editable: () => ({ type: "number" }),
        },
        {
          title: "Billable",
          key: "billable",
          editable: () => ({ type: "boolean" }),
        },
      ]}
      onEditable={(item) => {
        setPeople((prev) => prev.map((row) => (row.id === item.id ? item : row)));
      }}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
