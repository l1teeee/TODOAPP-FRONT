"use client";

import { Select } from "@/shared/ui/select";
import { useLists } from "../api/use-lists";

export interface ListSelectProps {
  id?: string;
  value: string | null | undefined;
  onChange: (listId: string | null) => void;
}

export function ListSelect({ id, value, onChange }: ListSelectProps) {
  const { data: lists } = useLists();

  return (
    <Select
      id={id}
      value={value ?? ""}
      onChange={(event) =>
        onChange(event.target.value ? event.target.value : null)
      }
    >
      <option value="">No list</option>
      {lists?.map((list) => (
        <option key={list.id} value={list.id}>
          {list.name}
        </option>
      ))}
    </Select>
  );
}
