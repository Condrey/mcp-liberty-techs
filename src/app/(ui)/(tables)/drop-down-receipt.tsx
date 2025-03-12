"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import kyInstance from "@/lib/ky";
import { Receipt } from "@prisma/client";
import {} from "@radix-ui/react-dropdown-menu";
import { Loader2Icon, MoreVerticalIcon, PrinterIcon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface DropDownReceiptsProps {
  receipt: Receipt;
}

export default function DropDownReceipt({ receipt }: DropDownReceiptsProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <MoreVerticalIcon className="size-4" />
          )}
          <span className="sr-only">View more</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              startTransition(async () => {
                const response = await kyInstance
                  .post("/api/printer", {
                    body: JSON.stringify(receipt),
                  })
                  .json<string>();
                toast(response);
              });
            }}
          >
            <PrinterIcon className="size-4 mr-2" />
            <span>Re-print</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
