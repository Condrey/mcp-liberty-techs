"use client";

import { Receipt } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getAllReceipts } from "./action";
import { DataTable } from "@/components/data-table/receipt-data-table";
import { useReceiptsColumn } from "./(tables)/columns";

interface ListOfReceiptsProps {
  receipts: Receipt[];
}
export default function ListOfReceipts({ receipts }: ListOfReceiptsProps) {
  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["receipt-list"],
    queryFn: getAllReceipts,
    initialData: receipts,
  });

  return (
    <div>
      <h1 className="text-xl">Recent receipts</h1>
      {status === "error" ? (
        <div>An error occurred</div>
      ) : status === "success" && !data.length ? (
        <div>No receipts in the db yet.</div>
      ) : (
        <DataTable columns={useReceiptsColumn} data={data}
        filterColumn={{id:'client',label:'buyer'}}
/>      )}
    </div>
  );
}
