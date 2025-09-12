"use client";

import SchoolSkeleton from "@/components/SchoolSkeleton";
import SearchBar from "@/components/SearchBar";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { School } from "../page";
import { History } from "lucide-react";
import React from "react";
import SchoolCard from "@/components/SchoolCard";
import DeleteSchool from "@/components/DeleteSchool";
import UpdateSchool, { Values } from "@/components/UpdateDialog";
import { handleError } from "@/lib/helpers";

export default function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const getSchools = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/user/schools");
      if (data.success) {
        setSchools(data.data);
        setFilteredSchools(data.data);
      }
    } catch (error) {
      const message = handleError(error);
      if (message !== "No schools found") {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (schoolId: number) => {
    setSchools((prev) => prev.filter((school) => school.id !== schoolId));
    setFilteredSchools((prev) =>
      prev.filter((school) => school.id !== schoolId)
    );
  };
  const onUpdate = async (schoolId: number, values: Values) => {
    setSchools((prev) =>
      prev.map((school) => {
        if (school.id === schoolId) {
          return {
            ...school,
            ...values,
            email_id: values.email,
          };
        } else {
          return school;
        }
      })
    );
    setFilteredSchools((prev) =>
      prev.map((school) => {
        if (school.id === schoolId) {
          return {
            ...school,
            ...values,
            email_id: values.email,
          };
        } else {
          return school;
        }
      })
    );
  };

  useEffect(() => {
    if (schools.length !== 0) return;
    getSchools();
  }, []);

  return (
    <div className="min-h-dvh sm:p-10 px-4 max-sm:py-6 max-w-6xl flex flex-col gap-6 mx-auto">
      <div className="space-y-2">
        <h1 className="sm:text-4xl text-3xl tracking-tight font-bold">
          Your Schools
        </h1>
        <p className="text-muted-foreground text-lg max-sm:text-sm font-medium">
          Manage and explore the schools you have added to your profile
        </p>
      </div>
      <SearchBar schools={schools} setSchools={setFilteredSchools} hideSelect />
      <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-4 gap-2 items-start flex-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SchoolSkeleton columns={3} buttons={2} key={index} />
          ))
        ) : filteredSchools.length > 0 ? (
          filteredSchools.map((school, index) => (
            <SchoolCard
              school={school}
              key={index}
              show={["address", "contact", "email_id"]}
              footer={
                <div className="flex flex-col gap-1 w-full">
                  <UpdateSchool
                    schoolId={school.id}
                    defaultValues={{
                      name: school.name,
                      address: school.address,
                      city: school.city,
                      state: school.state,
                      email: school.email_id ?? "",
                      contact: school.contact,
                      image: undefined,
                    }}
                    onUpdate={(values) => onUpdate(school.id, values)}
                  />
                  <DeleteSchool
                    schoolId={school.id}
                    onDelete={() => onDelete(school.id)}
                  />
                </div>
              }
            />
          ))
        ) : (
          <div className="lg:col-span-4 sm:col-span-3 col-span-2 flex flex-col items-center justify-center h-full gap-2">
            <History size="60" />
            <div className="flex gap-1 flex-col items-center">
              <h1 className="text-xl font-semibold tracking-tight">
                No Schools found
              </h1>
              <p className="text-muted-foreground text-sm">Add Schools now</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
