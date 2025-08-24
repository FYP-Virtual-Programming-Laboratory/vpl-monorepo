"use client";

import { useAdminAuth } from "@/components/admin/auth-provider";
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
import { adminPaths, home } from "@/paths";
import { AlertCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginModal() {
  const router = useRouter();
  const { login, isLoggingIn, user, error } = useAdminAuth();

  if (user) router.push(adminPaths.dashboard());

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
            Admin Login
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
          className="space-y-4 pt-4"
          onSubmit={(ev) => {
            ev.preventDefault();
            login(
              ev.currentTarget.email.value,
              ev.currentTarget.password.value
            );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@codelab.com"
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
            Login to Dashboard
          </Button>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Contact your administrator
            </a>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
