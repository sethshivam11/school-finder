"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { codeSchema } from "@/schema/userSchema";
import { Suspense, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { handleError } from "@/lib/helpers";

function Page() {
  const formSchema = codeSchema;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/verify", values);

      if (data.success) {
        router.replace(`/login?email=${encodeURIComponent(values.email)}`);
        toast.success("Account verified successfully");
      }
    } catch (error) {
      const message = handleError(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSendCode = async () => {
    setIsSending(true);

    try {
      const { data } = await axios.get(
        `/api/resend-code?email=${form.getValues("email")}`
      );

      if (data.success) {
        setTimer(60);
        intervalRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              return 0;
            } else {
              return prev - 1;
            }
          });
        }, 1000);
      }
    } catch (error) {
      const message = handleError(error);
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    try {
      const email = searchParams.get("email");
      if (email) {
        form.setValue("email", email);
      } else {
        toast.error("Please login again to verify your account.");
        router.replace("/login");
      }
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchParams]);

  return (
    <div className="min-h-dvh sm:p-10 px-4 max-sm:py-6 max-w-6xl flex flex-col gap-6 items-center mx-auto">
      <Card className="max-w-2xl w-full">
        <CardHeader className="items-center justify-center">
          <CardTitle className="text-2xl text-center">
            Verify Your Account
          </CardTitle>
          <CardDescription className="sr-only">
            In order to ensure the security of your account and authenticity, we
            require you to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter verification code"
                          {...field}
                          type="number"
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Please enter the 6-digit code sent to your email for
                        verification.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isSending}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={isSending || isSubmitting || timer > 0}
                >
                  Resend {timer > 0 ? `in ${timer}s` : "Code"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Verify() {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}
