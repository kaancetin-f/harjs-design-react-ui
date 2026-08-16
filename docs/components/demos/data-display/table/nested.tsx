"use client";

import { Table } from "@/lib/ui";

type Person = {
  id: string;
  name: string;
  contact: { city: string; email: string };
};

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", contact: { city: "London", email: "ada@harjs.design" } },
  { id: "2", name: "Alan Turing", contact: { city: "Manchester", email: "alan@harjs.design" } },
  { id: "3", name: "Grace Hopper", contact: { city: "New York", email: "grace@harjs.design" } },
  { id: "4", name: "Katherine Johnson", contact: { city: "White Sulphur Springs", email: "katherine@harjs.design" } },
];

export function TableNested() {
  return (
    <Table
      title="Contacts"
      description="Read nested fields with `key: { field, nestedKey }`."
      trackBy={(item) => item.id}
      data={people}
      columns={[
        { title: "Name", key: "name" },
        { title: "City", key: { field: "contact", nestedKey: "city" } },
        { title: "Email", key: { field: "contact", nestedKey: "email" } },
      ]}
      config={{ locale: "en", columnManagement: { enabled: false } }}
    />
  );
}
