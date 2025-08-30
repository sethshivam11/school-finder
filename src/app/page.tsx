"use client";

import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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
  const [schools, setSchools] = useState<School[]>([
    {
      name: "Springfield High",
      image:
        "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "mail@springfield.com",
      address: "123 Main St",
      city: "Springfield",
      state: "UP",
      contact: "1234567890",
    },
    {
      name: "Riverdale Academy",
      image:
        "https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "mail@riverdale.com",
      address: "456 Elm St",
      city: "Riverdale",
      state: "DL",
      contact: "9876543210",
    },
    {
      name: "Greenwood Public School",
      image:
        "https://images.pexels.com/photos/207756/pexels-photo-207756.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "info@greenwood.edu",
      address: "78 Oak Lane",
      city: "Lucknow",
      state: "UP",
      contact: "9123456789",
    },
    {
      name: "Hillcrest International",
      image:
        "https://images.pexels.com/photos/159844/school-classroom-class-learning-159844.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "contact@hillcrest.org",
      address: "98 Maple Ave",
      city: "Shimla",
      state: "HP",
      contact: "9988776655",
    },
    {
      name: "Sunshine Convent",
      image:
        "https://images.pexels.com/photos/267506/pexels-photo-267506.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "hello@sunshineconvent.com",
      address: "22 Rose St",
      city: "Jaipur",
      state: "RJ",
      contact: "8765432109",
    },
    {
      name: "St. Peter’s School",
      image:
        "https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "admin@stpeters.edu",
      address: "66 Pine Road",
      city: "Delhi",
      state: "DL",
      contact: "9012345678",
    },
    {
      name: "Bluebell Academy",
      image:
        "https://images.pexels.com/photos/159782/classroom-class-school-classroom-159782.jpeg?auto=compress&cs=tinysrgb&w=800",
      email: "contact@bluebell.edu",
      address: "45 Lily Street",
      city: "Chandigarh",
      state: "CH",
      contact: "8899776655",
    },
  ]);
  return (
    <div className="min-h-dvh p-10 max-w-6xl flex flex-col gap-6 mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl tracking-tight font-bold">
          Find the Perfect School
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Discover top-rated educational institutions that shape tomorrow&apos;s
          leaders
        </p>
      </div>
      <SearchBar schools={schools} setSchools={setSchools} />
      <div className="grid grid-cols-4 gap-4 hover:shadow-sm">
        {schools.map((school, index) => (
          <div
            className="flex flex-col justify-center gap-2 ring ring-input rounded-xl"
            key={index}
          >
            <div className="rounded-t-xl overflow-hidden">
              <Image
                src={school.image}
                alt={school.name}
                width="400"
                height="400"
                className="object-cover hover:scale-105 transition duration-300 ease-in-out rounded-t-lg aspect-square"
              />
            </div>
            <div className="flex flex-col justify-center gap-2 px-2 pb-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl tracking-tight text-semibold">
                  {school.name}
                </h1>
                <div className="flex gap-1 items-center">
                  <MapPin size="20" />
                  <p className="text-muted-foreground">
                    {school.address}, {school.city}
                  </p>
                </div>
              </div>
              <Button className="w-full">Apply Now</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
