"use client";

import SchoolCard from "@/components/SchoolCard";
import SchoolSkeleton from "@/components/SchoolSkeleton";
import SearchBar from "@/components/SearchBar";
import axios, { AxiosError } from "axios";
import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface School {
  name: string;
  image: string;
  email: string;
  address: string;
  city: string;
  state: string;
  contact: string;
}

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const getSchools = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/schools");
      if (data.success) {
        setSchools(data.data);
        setFilteredSchools(data.data);
      }
    } catch (error) {
      console.error(error);
      let message = error instanceof Error ? error.message : String(error);
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (schools.length !== 0) return;
    getSchools();
  }, []);

  return (
    <div className="min-h-dvh sm:p-10 px-4 max-sm:py-6 max-w-6xl flex flex-col gap-6 mx-auto">
      <div className="space-y-2">
        <h1 className="sm:text-4xl text-3xl tracking-tight font-bold">
          Find the Perfect School
        </h1>
        <p className="text-muted-foreground text-lg max-sm:text-sm font-medium">
          Discover top-rated educational institutions that shape tomorrow&apos;s
          leaders
        </p>
      </div>
      <SearchBar schools={schools} setSchools={setFilteredSchools} />
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2 items-start flex-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SchoolSkeleton key={index} />
          ))
        ) : filteredSchools.length > 0 ? (
          filteredSchools.map((school, index) => (
            <SchoolCard school={school} key={index} />
          ))
        ) : (
          <div className="lg:col-span-4 sm:col-span-3 flex flex-col items-center justify-center h-full gap-2">
            <History size="40" />
            <h1 className="text-xl font-semibold tracking-tight">
              No Schools found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
