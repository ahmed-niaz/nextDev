import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectDropDownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SelectDropDown({ value, onChange }: SelectDropDownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Event Mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="online">online</SelectItem>
          <SelectItem value="offline">offline</SelectItem>
          <SelectItem value="hybrid">hybrid</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
