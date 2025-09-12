import React, { useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { schoolSchema } from "@/schema/schoolSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State, City } from "country-state-city";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { handleError } from "@/lib/helpers";

export interface Values {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  contact: string;
}

function UpdateSchool({
  schoolId,
  defaultValues = {
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    image: undefined as File | undefined,
  },
  onUpdate,
}: {
  schoolId: number;
  defaultValues: Values & { image?: File };
  onUpdate: (values: Values & { image: string }) => void;
}) {
  const [loading, setLoading] = useState(false);

  const normalizedDefaults = useMemo(() => {
    const stateObj = State.getStatesOfCountry("IN").find(
      (s) => s.name.toLowerCase() === defaultValues.state.toLowerCase()
    );

    return {
      ...defaultValues,
      state: stateObj?.isoCode || defaultValues.state,
    };
  }, [defaultValues]);

  const form = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues: normalizedDefaults,
  });

  async function onSubmit(values: z.infer<typeof schoolSchema>) {
    if (loading) return;
    try {
      setLoading(true);
      const state =
        State.getStateByCodeAndCountry(values.state, "IN")?.name ||
        values.state;
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("city", values.city);
      formData.append("state", state);
      formData.append("contact", values.contact);
      if (values.image) formData.append("image", values.image);

      const { data } = await axios.post(`/api/school/${schoolId}`, formData);
      if (data.success) {
        form.reset();
        toast.success("School updated successfully");
        onUpdate(data.data);
      }
    } catch (error) {
      const message = handleError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PenBox /> Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight text-center font-bold">
            Update School
          </DialogTitle>
          <DialogDescription className="text-center">
            Make changes to the school here
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 sm:gap-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Address to your school"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 sm:gap-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="state">State</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="state" className="w-full">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {State.getStatesOfCountry("IN").map(
                              (state, index) => (
                                <SelectItem value={state.isoCode} key={index}>
                                  {state.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="city">City</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="city" className="w-full">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {City.getCitiesOfState("IN", form.watch("state"))
                              .length > 0 ? (
                              City.getCitiesOfState(
                                "IN",
                                form.watch("state")
                              ).map((city, index) => (
                                <SelectItem value={city.name} key={index}>
                                  {city.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="N/A" disabled>
                                Select state first
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="gap-1">
                      Image
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Name of your school"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        accept="image/png,image/jpg,image/jpeg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <DialogClose asChild>
                  <Button type="submit" className="w-full" disabled={loading}>
                    Update
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateSchool;
