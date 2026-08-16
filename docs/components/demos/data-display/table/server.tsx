"use client";

import { useMemo, useState } from "react";
import { Chip, Table } from "@/lib/ui";

type Status = "Active" | "Away" | "On leave";

type Person = {
  id: string;
  name: string;
  role: string;
  team: string;
  status: Status;
};

type Sort = { key: keyof Person; direction: "asc" | "desc" | null };

const catalog: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", team: "Platform", status: "Active" },
  { id: "2", name: "Alan Turing", role: "Research", team: "Crypto", status: "Active" },
  { id: "3", name: "Grace Hopper", role: "Lead", team: "Compiler", status: "Away" },
  { id: "4", name: "Katherine Johnson", role: "Analyst", team: "Flight", status: "Active" },
  { id: "5", name: "Margaret Hamilton", role: "Engineer", team: "Apollo", status: "On leave" },
  { id: "6", name: "Donald Knuth", role: "Research", team: "Typesetting", status: "Active" },
  { id: "7", name: "Barbara Liskov", role: "Lead", team: "Platform", status: "Active" },
  { id: "8", name: "Hedy Lamarr", role: "Engineer", team: "Crypto", status: "Away" },
  { id: "9", name: "Tim Berners-Lee", role: "Engineer", team: "Platform", status: "Active" },
  { id: "10", name: "Radia Perlman", role: "Analyst", team: "Compiler", status: "Active" },
  { id: "11", name: "Frances Allen", role: "Research", team: "Compiler", status: "On leave" },
  { id: "12", name: "Ken Thompson", role: "Engineer", team: "Platform", status: "Away" },
];

const statusColor: Record<Status, "green" | "orange" | "gray"> = {
  Active: "green",
  Away: "orange",
  "On leave": "gray",
};

function readFilter(params: Record<string, { value?: unknown } | { value?: unknown }[]> | null, key: string) {
  const entry = params?.[key];
  if (!entry) return "";
  const first = Array.isArray(entry) ? entry[0] : entry;
  return String(first?.value ?? "")
    .trim()
    .toLowerCase();
}

export function TableServer() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<Record<string, { value?: unknown } | { value?: unknown }[]> | null>(null);
  const [sorts, setSorts] = useState<Sort[]>([]);

  const filtered = useMemo(() => {
    let next = [...catalog];
    const name = readFilter(filters, "name");
    const role = readFilter(filters, "role");
    const team = readFilter(filters, "team");

    if (name) next = next.filter((item) => item.name.toLowerCase().includes(name));
    if (role) next = next.filter((item) => item.role.toLowerCase().includes(role));
    if (team) next = next.filter((item) => item.team.toLowerCase().includes(team));

    for (const sort of sorts) {
      if (!sort.direction) continue;
      next.sort((a, b) => {
        const left = String(a[sort.key] ?? "");
        const right = String(b[sort.key] ?? "");
        if (left < right) return sort.direction === "asc" ? -1 : 1;
        if (left > right) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return next;
  }, [filters, sorts]);

  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Table
      title="Directory"
      description="`isServerSide` leaves filtering, sorting, and paging to you. Table only emits the query."
      trackBy={(item) => item.id}
      data={pageItems}
      columns={[
        { title: "Name", key: "name", filterDataType: "string" },
        { title: "Role", key: "role", filterDataType: "string" },
        { title: "Team", key: "team", filterDataType: "string" },
        {
          title: "Status",
          key: "status",
          render: (item) => <Chip text={item.status} color={statusColor[item.status]} variant="surface" size="sm" />,
        },
      ]}
      searchedParams={(params) => {
        setFilters(params);
        setPage(1);
      }}
      sortedParams={(params) => setSorts(params)}
      pagination={{
        totalRecords: filtered.length,
        perPage,
        currentPage: page,
        onChange: (nextPage, nextPerPage) => {
          setPage(nextPage);
          setPerPage(nextPerPage);
        },
      }}
      config={{
        locale: "en",
        isServerSide: true,
        isSearchable: true,
        isProperties: true,
        columnManagement: { enabled: false },
      }}
    />
  );
}
