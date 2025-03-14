"use client";

import LoadingButton from "@/components/loading-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format, sub } from "date-fns";
import { Loader2Icon } from "lucide-react";
import BtnPayBalance from "./(tables)/btn-pay-balance";
import { getAllDefaulters } from "./action";
import { Badge } from "@/components/ui/badge";

export default function ListOfDefaulters() {
  const { status, data, error, refetch, isFetching } = useQuery({
    queryKey: ["defaulters-list"],
    queryFn: getAllDefaulters,
  });
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 gap-4 justify-center items-center  size-full min-h-[30rem] w-full max-w-md border rounded-md p-4">
        <p className="text-center max-w-sm text-muted-foreground">
          Loading defaulters...
        </p>
        <Loader2Icon className="size-4 animate-spin" />
      </div>
    );
  }
  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[20rem]">
        <p className="text-center max-w-sm text-muted-foreground">
          An error occurred while fetching a list of defaulters.
        </p>
        <LoadingButton
          className="w-fit"
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[20rem]">
        <p className="text-center max-w-sm text-muted-foreground">
          There are no defaulters in the database yet.
        </p>
      </div>
    );
  }

  return (
    <div className=" space-y-2   ">
      <h1 className="text-xl font-semibold">List of all defaulters</h1>
      <Table className="border rounded-md ">
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Last updated date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d, index) => {
             const balance = d.balance;
                  const isLessThanSixMonth =
                    sub(new Date(), { months: 6 }) < d.createdAt;
            
            return (
              <TableRow key={d.id} className="divide-y-1">
                <TableCell className="text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{d.client}</div>
                    <div className=" text-muted-foreground text-xs">
                      {d.contact}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(d.balance)}</TableCell>
                <TableCell className="text-xs">
                  <Badge title={isLessThanSixMonth?'Less than six month':'More than six month'} variant={isLessThanSixMonth?'outline':'destructive'}>{format(d.updatedAt, "PPpp")}</Badge>
                </TableCell>
                <TableCell>
                  <BtnPayBalance receipt={d} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
