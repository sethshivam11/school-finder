import SchoolForm from "@/components/SchoolForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { School } from "lucide-react";

function Page() {
  return (
    <div className="min-h-dvh sm:p-10 px-4 max-sm:py-6 max-w-4xl flex flex-col gap-6 mx-auto">
      <div className="space-y-2">
        <h1 className="sm:text-4xl text-3xl tracking-tight font-bold">
          Register your School
        </h1>
        <p className="text-muted-foreground text-lg max-sm:text-sm font-medium">
          Join our platform and connect with students and parents looking for
          quality education
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <School size="24" /> School Information
          </CardTitle>
          <CardDescription className="text-center">
            Please fill out all the required information about your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;