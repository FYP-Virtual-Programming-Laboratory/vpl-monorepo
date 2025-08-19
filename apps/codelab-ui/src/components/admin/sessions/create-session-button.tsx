"use client";

import { CreateSessionDialog } from "@/components/admin/sessions/create-session-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export function CreateSessionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-teal-800 hover:bg-teal-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" /> Create session
      </Button>
      <CreateSessionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
