"use client";

import { Chip, GridSystem, Table } from "@/lib/ui";

const { Flex } = GridSystem;

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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function TableRender() {
  return (
    <Table
      title="Capacity"
      description="`render` owns the cell. Alignment and width live on `config`."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        {
          title: "Name",
          key: "name",
          render: (item) => (
            <Flex alignItems="center" gap="var(--space-8)">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "999px",
                  background: "var(--blue-100)",
                  color: "var(--blue-700)",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                }}
              >
                {initials(item.name)}
              </span>
              <span>{item.name}</span>
            </Flex>
          ),
        },
        { title: "Team", key: "team" },
        {
          title: "Status",
          key: "status",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
        {
          title: "Hours",
          key: "hours",
          config: { alignContent: "right", width: 88 },
          render: (item) => <span style={{ fontVariantNumeric: "tabular-nums" }}>{item.hours}h</span>,
        },
      ]}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
