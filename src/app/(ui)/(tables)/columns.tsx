"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { shopCategories } from "@/lib/enums";
import { formatCurrency } from "@/lib/utils";
import { Receipt, ShopCategory } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format, sub } from "date-fns";
import { UserIcon } from "lucide-react";
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
      <div className="flex gap-2 items-center">
        <UserIcon
          className=" fill-foreground/50 border rounded-full "
          strokeWidth={0.5}
        />

        <div>
          <div className=" capitalize">{row.original.client}</div>
          <div className="text-muted-foreground text-xs">
            {row.original.contact}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Shop category" />;
    },
    cell: ({ row }) => {
      const c = shopCategories[row.original.category];
      const Icon = c.icon;
      const isMCP = row.original.category===ShopCategory.MCP
      return (
        <div>
          <Badge variant={isMCP?'outline':'secondary'}><Icon className="fill-background"/>{c.name}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      const Icon = shopCategories[row.original.category].icon;
      return (
        <div className="flex gap-2 items-center">
          {/* <Icon className=" fill-foreground/50" strokeWidth={0.5}/> */}
          <div>
            <div className=" capitalize">{row.original.name}</div>
            <div className="text-muted-foreground text-xs uppercase">
              {row.original.serialNumber}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "Price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <span className="">{formatCurrency(row.original.amount+row.original.balance)}</span>
    ),
  },  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount paid" />
    ),
    cell: ({ row }) => {
      const balance = row.original.balance;
      const isCleared = balance <= 0;

      return(
        <div>
          
      <span className="">{formatCurrency(row.original.amount)}</span>
          <p
       
            className=" capitalize text-xs italic text-muted-foreground"
        
          >
            {isCleared ? "--No balance--" : ` balance of ${formatCurrency(balance)}`}
          </p>
      </div>
    )},
  },
  {
    accessorKey: "balance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.original.balance;
      const isCleared = balance <= 0;
      const isLessThanSixMonth =
        sub(new Date(), { months: 6 }) < row.original.createdAt;
      return (
        <div>
          <div>
            <Badge
              title={
                isCleared
                  ? "No pending balance"
                  : isLessThanSixMonth
                  ? "Balance is less than six month"
                  : "Balance is greater than six month"
              }
              className=" capitalize w-full"
              variant={
                isCleared
                  ? "go"
                 
                  : "destructive"
              }
            >
              {isCleared ? "No balance" : formatCurrency(balance)}
            </Badge>
          </div>
        </div>
      );
    },
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
          <div className="text-xs text-muted-foreground">
            Updated {format(row.original.updatedAt, "PPpp")}
          </div>
        )}
      </div>
    ),
  },
  {
    id: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      return <DropDownReceipt receipt={row.original} />;
    },
  },
];
