"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { cn, formatCurrency } from "@/lib/utils";
import { Receipt } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format, sub } from "date-fns";
import { Badge } from "@/components/ui/badge";
import DropDownReceipt from "./drop-down-receipt";

export const useReceiptsColumn: ColumnDef<Receipt>[] = [
  {
    id: "index",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buyer" />
    ),
    cell: ({ row }) => (
      <div>
        <div className=" capitalize">{row.original.client}</div>
        <div className=" text-xs">
          {row.original.contact}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <div>
        <div className=" capitalize">{row.original.name}</div>
        <div className=" text-xs uppercase">
          {row.original.serialNumber}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.original.balance
      return(
      <div>
        <div        
        >
         {
          balance<=0?
          <Badge>No balance</Badge>:
          formatCurrency(row.original.balance)
         }
        </div>
      </div>
    )},
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div>
        <div>{format(row.original.createdAt, "PPpp")}</div>
        {row.original.updatedAt > row.original.createdAt && (
          <div className="text-xs ">
            {format(row.original.updatedAt, "PPpp")}
          </div>
        )}
      </div>
    ),
  },{
    id:'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
cell:({row})=>{
  return <DropDownReceipt receipt={row.original}/>
}
  }
];
