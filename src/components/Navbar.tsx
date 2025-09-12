"use client";

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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { signOut, useSession } from "next-auth/react";

function Navbar() {
  const { status } = useSession();

  const navOptions = [
    {
      name: "Home",
      route: "/",
    },
    ...(status === "loading"
      ? []
      : status === "authenticated"
      ? [
          { name: "Dashboard", route: "/dashboard" },
          { name: "Add School", route: "/add-school" },
        ]
      : [
          { name: "Login", route: "/login" },
          { name: "Sign Up", route: "/sign-up" },
        ]),
  ];

  return (
    <div className="sticky top-0 left-0 w-full bg-white/50 dark:bg-black/50 z-50 backdrop-blur sm:py-2 py-0.5 sm:px-6 px-2 flex items-center justify-between border-b border-input">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <Menu size="24" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex items-center flex-col p-2">
              {navOptions.map((option, index) => (
                <SheetClose key={index} asChild>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={option.route}>{option.name}</Link>
                  </Button>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-red-500 hover:bg-red-100 hover:dark:bg-red-950"
                  onClick={() => signOut()}
                >
                  Logout
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
          <div className="flex items-center justify-evenly gap-2 max-md:hidden">
            {navOptions.map((option, index) => (
              <Button size="sm" variant="ghost" key={index} asChild>
                <Link href={option.route}>{option.name}</Link>
              </Button>
            ))}
            {status === "authenticated" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    You can always log back in at any time. Are you sure you
                    want to Logout?
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/80"
                      onClick={() => signOut()}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
