"use client";

import { DataTable } from "@/components/data-table/data-table";
import LoadingButton from "@/components/loading-button";
import { Receipt } from "@prisma/client";
import BtnAddReceipt from "./(tables)/btn-add-receipt";
import { useReceiptsColumn } from "./(tables)/columns";
import { useFetchReceiptsQuery } from "./hook";

interface ListOfReceiptsProps {
  receipts: Receipt[];
}
export default function ListOfReceipts({ receipts }: ListOfReceiptsProps) {
  const { data, status, error, refetch, isFetching } =
    useFetchReceiptsQuery(receipts);
  if (status === "error") {
    console.error(error);
  }
  return (
    <div className="space-y-2 tracking-wide">
      {status === "error" ? (
        <div className="flex flex-col gap-4 justify-center items-center min-h-[20rem]">
          <p className="text-center max-w-sm text-muted-foreground">
            An error occurred
          </p>
          <LoadingButton loading={isFetching} onClick={() => refetch()}>
            Refresh
          </LoadingButton>
        </div>
      ) : status === "success" && !data.length ? (
        <div className="flex flex-col gap-4 justify-center items-center min-h-[20rem]">
          <p className="text-center max-w-sm text-muted-foreground">
            No receipts in the db yet. Please add
          </p>
          <BtnAddReceipt />
        </div>
      ) : (
        <div className=" flex w-full overflow-y-auto max-w-md sm:max-w-2xl mx-auto md:max-w-4xl lg:max-w-5xl xl:max-w-fit">
          <DataTable
            columns={useReceiptsColumn}
            data={data}
            filterColumn={{ id: "client", label: "buyer" }}
            tableHeaderSection={
              <div className="w-full flex justify-end">
                <h1 className="text-xl text-center">Recently added receipts</h1>
                <BtnAddReceipt />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
