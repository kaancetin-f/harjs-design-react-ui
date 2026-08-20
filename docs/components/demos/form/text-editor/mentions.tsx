"use client";

import { useState } from "react";
import { TextEditor } from "@/lib/ui";

type Person = { id: number; name: string };

const people: Person[] = [
  { id: 1, name: "Ahmet Çelik" },
  { id: 2, name: "Ali Koç" },
  { id: 3, name: "Ayşe Yılmaz" },
  { id: 4, name: "Caner Aksoy" },
  { id: 5, name: "Elif Kaya" },
  { id: 6, name: "Emre Yıldız" },
  { id: 7, name: "Fatma Öztürk" },
  { id: 8, name: "Hatice Aydın" },
  { id: 9, name: "Mehmet Demir" },
  { id: 10, name: "Merve Özdemir" },
  { id: 11, name: "Mustafa Arslan" },
  { id: 12, name: "Zeynep Şahin" },
];

export function TextEditorMentions() {
  const [value, setValue] = useState("<p>Type @ to mention someone</p>");
  const [tagged, setTagged] = useState<Person[]>([]);

  return (
    <>
      <TextEditor
        placeholder="Write a note"
        height={200}
        value={value}
        onChange={(next) => setValue(next ?? "")}
        dynamicList={{
          triggerKey: "@",
          color: "purple",
          render: { display: "name", items: people },
          onTagged: setTagged,
        }}
      />
      {tagged.length > 0 && (
        <p style={{ marginTop: 12, color: "var(--gray-600)", fontSize: 13 }}>
          Mentioned: {tagged.map((person) => person.name).join(", ")}
        </p>
      )}
    </>
  );
}
