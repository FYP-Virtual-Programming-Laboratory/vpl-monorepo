"use client";

import { useStudentAuth } from "@/components/student/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { home, studentPaths, studentSignup } from "@/paths";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentLoginModal() {
  const router = useRouter();
  const { login, isLoggingIn, user, error } = useStudentAuth();

  if (user) {
    router.push(studentPaths.sessions());
  }

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
            Student Login
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon size={"1rem"} />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={(ev) => {
            ev.preventDefault();

            login(
              ev.currentTarget.username.value,
              ev.currentTarget.password.value
            );
          }}
          className="space-y-4 pt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Your Matric Number</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="U12345678"
              required
              disabled={isLoggingIn}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoggingIn}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={studentSignup()}
              className="text-emerald-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
