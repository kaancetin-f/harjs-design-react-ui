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
  joined: string;
  hours: number;
};

const people: Person[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    role: "Engineer",
    team: "Platform",
    status: "Active",
    location: "London",
    joined: "2023-04-12",
    hours: 36,
  },
  {
    id: "2",
    name: "Alan Turing",
    role: "Research",
    team: "Crypto",
    status: "Active",
    location: "Manchester",
    joined: "2022-11-03",
    hours: 32,
  },
  {
    id: "3",
    name: "Grace Hopper",
    role: "Lead",
    team: "Compiler",
    status: "Away",
    location: "New York",
    joined: "2021-06-18",
    hours: 20,
  },
  {
    id: "4",
    name: "Katherine Johnson",
    role: "Analyst",
    team: "Flight",
    status: "Active",
    location: "West Virginia",
    joined: "2024-01-09",
    hours: 40,
  },
  {
    id: "5",
    name: "Margaret Hamilton",
    role: "Engineer",
    team: "Apollo",
    status: "On leave",
    location: "Cambridge",
    joined: "2020-08-22",
    hours: 0,
  },
  {
    id: "6",
    name: "Donald Knuth",
    role: "Research",
    team: "Typesetting",
    status: "Active",
    location: "Stanford",
    joined: "2019-02-14",
    hours: 28,
  },
  {
    id: "7",
    name: "Barbara Liskov",
    role: "Lead",
    team: "Platform",
    status: "Active",
    location: "MIT",
    joined: "2023-09-01",
    hours: 34,
  },
  {
    id: "8",
    name: "Hedy Lamarr",
    role: "Engineer",
    team: "Crypto",
    status: "Away",
    location: "Vienna",
    joined: "2024-05-20",
    hours: 16,
  },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

export function TableSticky() {
  return (
    <Table
      title="Directory"
      description="Pin Name to the left. The body scrolls inside `config.scroll.maxHeight`."
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
        { title: "Location", key: "location", config: { width: 160 } },
        { title: "Joined", key: "joined", config: { width: 120 } },
        { title: "Hours", key: "hours", config: { width: 96, alignContent: "right" } },
      ]}
      config={{
        locale: "en",
        columnManagement: { enabled: false },
        scroll: { maxHeight: 280 },
      }}
    />
  );
}
