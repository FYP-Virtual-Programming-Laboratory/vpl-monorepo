"use client";

import { signup } from "@/api/student/auth";
import { useStudentAuth } from "@/components/student/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { home, studentLogin, studentPaths } from "@/paths";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z
  .object({
    matricNumber: z.string().min(1, "Matric number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export default function StudentSignUpModal() {
  const router = useRouter();
  const { setAuthDetails } = useStudentAuth();
  const form = useForm({
    defaultValues: {
      matricNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess(data) {
      setAuthDetails(data.token, data.profile);
      router.push(studentPaths.sessions());
    },
  });

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={() => {
        router.push(home());
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-emerald-800">
            Student Registration
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon size={"1rem"} />
            <AlertTitle>Registration Failed</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="matricNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Matric Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="U12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
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
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6"
              disabled={isPending}
            >
              Register
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={studentLogin()}
                className="text-emerald-600 hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
