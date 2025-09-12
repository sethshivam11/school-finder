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
  hideSelect = false,
}: {
  schools: School[];
  setSchools: (schools: School[]) => void;
  hideSelect?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const handleSearch = () => {
    setSchools(
      schools.filter((school) =>
        school.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    );
  };

  return (
    <div className="grid sm:grid-cols-4 gap-2">
      <div className="flex gap-2 sm:col-span-3">
        <Input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            if (value === "") setSchools(schools);
            else {
              setSchools(
                schools.filter((school) =>
                  school.name.toLowerCase().includes(value.trim().toLowerCase())
                )
              );
            }
          }}
          placeholder="Search schools"
        />
        <Button variant="secondary" onClick={handleSearch}>
          <Search size="24" /> Search
        </Button>
      </div>

      {!hideSelect && (
        <Select
          value={selectedCity}
          onValueChange={(value) => {
            if (value === "all") {
              setSchools(schools);
            } else {
              setSchools(schools.filter((school) => school.city === value));
            }
            setSelectedCity(value);
          }}
        >
          <SelectTrigger id="state" className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {[...new Set(schools.map((school) => school.city))].map(
              (city, index) => (
                <SelectItem value={city} key={index} className="capitalize">
                  {city}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export default Searchbar;
