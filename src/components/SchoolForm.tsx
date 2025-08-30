"use client";

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
import { schoolSchema } from "@/schema/schoolSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CardFooter } from "./ui/card";
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

function SchoolForm() {
  const [state, setState] = useState("");
  const form = useForm({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      contact: "",
      image: "",
    },
  });

  function onSubmit(values: z.infer<typeof schoolSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="space-y-8">
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
          <div className="flex gap-2">
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
                    <Input
                      placeholder="Contact number of your school"
                      {...field}
                    />
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
                  <Textarea placeholder="Address to your school" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="state">State</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setState(value);
                      }}
                    >
                      <SelectTrigger id="state" className="w-full">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {State.getStatesOfCountry("IN").map((city, index) => (
                          <SelectItem value={city.name} key={index}>{city.name}</SelectItem>
                        ))} 
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="city" className="w-full">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {City.getCitiesOfState("IN", state).length > 0 ? (
                          City.getCitiesOfState("IN", state).map((city, index) => (
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
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Name of your school"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="p-0">
            <Button type="submit" className="w-full">
              Register
            </Button>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
}

export default SchoolForm;
