"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import FormAddEditReceipt from "./form-add-edit-receipt";

export default function BtnAddReceipt() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="w-full max-w-fit ml-auto"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="size-4 mr-1" />
        <span> New receipt</span>
      </Button>
      <FormAddEditReceipt open={open} setOpen={setOpen} />
    </>
  );
}
