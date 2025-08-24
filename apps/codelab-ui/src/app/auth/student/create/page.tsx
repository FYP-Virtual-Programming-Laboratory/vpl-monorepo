"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { home, studentLogin } from "@/paths";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentSignUpModal() {
  const router = useRouter();

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
        <form onSubmit={() => {}} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="matric-number">Your Matric Number</Label>
            <Input
              id="matric-number"
              type="text"
              placeholder="U12345678"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" type="text" placeholder="John" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input id="last-name" type="text" placeholder="Doe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              required
              className="pr-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              placeholder="••••••••"
              required
              className="pr-10"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white mt-6"
            disabled={true}
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
      </DialogContent>
    </Dialog>
  );
}
