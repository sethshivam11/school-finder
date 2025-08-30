"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { School } from "@/app/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Searchbar({
  schools,
  setSchools,
}: {
  schools: School[];
  setSchools: (schools: School[]) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <div className="grid grid-cols-10 justify-between gap-2">
      <div className="flex gap-2 col-span-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schools"
        />
        <Button>
          <Search size="24" /> Search
        </Button>
      </div>
      <Select>
        <SelectTrigger id="state" className="w-full col-span-2 hidden">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          {
            new Set(
              schools.map((school, index) => (
                <SelectItem value={school.city} className="capitalize" key={index}>
                  {school.city}
                </SelectItem>
              ))
            )
          }
        </SelectContent>
      </Select>
    </div>
  );
}

export default Searchbar;
