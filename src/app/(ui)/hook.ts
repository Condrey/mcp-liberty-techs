'use client'

import { Receipt } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getAllReceipts } from "./action";

export function useFetchReceiptsQuery(initialData: Receipt[]){
  return useQuery({
        queryKey: ["receipt-list"],
        queryFn: getAllReceipts,
        initialData,
      });
}