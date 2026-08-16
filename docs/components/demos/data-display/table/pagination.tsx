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

const names = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Katherine Johnson",
  "Margaret Hamilton",
  "Donald Knuth",
  "Barbara Liskov",
  "Edsger Dijkstra",
  "John von Neumann",
  "Claude Shannon",
  "Hedy Lamarr",
  "Tim Berners-Lee",
  "Radia Perlman",
  "Frances Allen",
  "Dennis Ritchie",
  "Ken Thompson",
  "Jean Bartik",
  "Mary Jackson",
];

const roles = ["Engineer", "Lead", "Analyst", "Research"];
const teams = ["Platform", "Crypto", "Compiler", "Flight", "Apollo"];
const statuses: Status[] = ["Active", "Active", "Away", "On leave"];

const people: Person[] = names.map((name, index) => ({
  id: String(index + 1),
  name,
  role: roles[index % roles.length],
  team: teams[index % teams.length],
  status: statuses[index % statuses.length],
}));

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TablePagination() {
  return (
    <Table
      title="Directory"
      description="Client-side paging. Table slices `data` with `perPage`."
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
      ]}
      pagination={{ totalRecords: people.length, perPage: 10 }}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
