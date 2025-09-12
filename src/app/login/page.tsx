"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { loginSchema } from "@/schema/userSchema";
import React, { Suspense, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function Page() {
  const formSchema = loginSchema;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      if (result.error === "User is not verified") {
        toast.warning("Please verify your email to continue");
        router.push(`/verify?email=${encodeURIComponent(values.email)}`);
        return;
      }

      toast.error(result.error || "Incorrect email or password");
    }

    if (result?.url) {
      toast.success("Login Successful");
      router.replace(result.url);
    }

    setIsSubmitting(false);
  }

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      form.setValue("email", email);
    }
  }, [searchParams]);

  return (
    <div className="min-h-dvh sm:p-10 px-4 max-sm:py-6 max-w-6xl flex flex-col gap-6 items-center mx-auto">
      <Card className="max-w-2xl w-full">
        <CardHeader className="items-center justify-center">
          <CardTitle className="text-2xl text-center">
            Login to School Finder
          </CardTitle>
          <CardDescription className="text-center">
            Please login to your School Finder account to access your dashboard
            and manage your school listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={showPwd ? "text" : "password"}
                          placeholder="Enter a password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2 py-4">
                <Checkbox
                  id="show-password"
                  checked={showPwd}
                  onCheckedChange={(checked: boolean) => setShowPwd(checked)}
                />
                <Label htmlFor="show-password">Show Password</Label>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/sign-up">Register with Us</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
