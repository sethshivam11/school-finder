import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Navbar() {
  return (
    <div className="sticky top-0 left-0 w-full bg-white/50 dark:bg-black/50 z-50 backdrop-blur sm:py-2 py-0.5 sm:px-6 px-2 flex items-center justify-between border-b border-input">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <Menu size="24" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex items-center flex-col p-2">
              <SheetClose asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/">Home</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="add-school">Add School</Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width="50" height="50" />
          <h1 className="font-bold tracking-tight text-xl">School Finder</h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-evenly gap-2 max-sm:hidden">
            <Button size="sm" variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href="add-school">Add School</Link>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
