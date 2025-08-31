import { School } from "@/app/page";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

function SchoolCard({ school }: { school: School }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:rounded-xl rounded-lg bg-card border-card">
      <div className="sm:rounded-t-xl rounded-t-lg overflow-hidden relative">
        <Image
          src={school.image || "/logo.svg"}
          alt={school.name}
          width="400"
          height="400"
          className="object-cover hover:scale-105 transition duration-300 ease-in-out rounded-t-lg aspect-square w-full"
        />
      </div>
      <div className="flex flex-col justify-center gap-2 sm:px-3 px-2 sm:pb-3 pb-2">
        <div className="flex flex-col gap-0.5">
          <h1
            className="md:text-xl text-lg tracking-tight font-semibold max-w-full truncate"
            title={school.name}
          >
            {school.name}
          </h1>
          <div className="flex gap-1 items-center">
            <MapPin size="16" className="shrink-0" />
            <p
              className="text-muted-foreground text-sm truncate"
              title={`${school.address}, ${school.city}`}
            >
              {school.address}, {school.city}
            </p>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link
            href={`tel:${school.contact}`}
            className="w-full max-sm:text-sm"
          >
            <Phone /> Call Now
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default SchoolCard;
