"use client";

import kyInstance from "@/lib/ky";
import { Receipt } from "@prisma/client";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteReceipt, payDebt, upsertReceipt } from "../action";

 const queryKey: QueryKey = ["receipt-list"];
  const key2:QueryKey = ["defaulters-list"]
  const key3:QueryKey = ['sales-chart']

export const useAddReceiptMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: upsertReceipt,
    async onSuccess(data, variables, context) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Receipt[]>(queryKey, (old) => {
        if (!old) return;
        if (!variables.id) {
          return [...old, data];
        }
        return old.map((d) => (d.id === data.id ? data : d));
      });

      if (!variables.id) {
        const response = await kyInstance
          .post("/api/printer", {
            body: JSON.stringify(data),
          })
          .json<string>();
        toast(response);
      } else {
        toast("Successfully updated receipt");
      }
      queryClient.invalidateQueries({queryKey:key2})
      queryClient.invalidateQueries({queryKey:key3})
    },
    onError(error, variables, context) {
      console.error(error);
      toast("Failed to update receipt list. Please try again.");
    },
  });
  return mutation;
};

export const useDeleteReceiptMutation = () => {
  const { mutate, isPending } = useAddReceiptMutation();
 
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteReceipt,
    async onSuccess(data, variables, context) {
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<Receipt[]>(queryKey, (old) =>
        old?.filter((d) => d.id !== data.id)
      );

      toast("Successfully deleted receipt", {
        action: {
          label: "Undo",
          onClick: () => mutate(data),
        },
      });
      queryClient.invalidateQueries({queryKey:key2})
      queryClient.invalidateQueries({queryKey:key3})

    },
    onError(error, variables, context) {
      console.error(error);
      toast("Failed to update receipt list. Please try again.");
    },
  });
  return mutation;
};


export const usePayBalanceMutation = ()=>{
  
  const queryClient = useQueryClient();
  return useMutation({
mutationFn: payDebt,
async onSuccess(data, variables, context) {
  queryClient.invalidateQueries({queryKey})
  queryClient.invalidateQueries({queryKey:key2})
  queryClient.invalidateQueries({queryKey:key3})
  const response = await kyInstance
  .post("/api/printer", {
    body: JSON.stringify(data),
  })
  .json<string>();
toast(response);
},
onError(error, variables, context) {
  console.error(error);
  toast("Failed to update receipt list. Please try again.");
},

  })
}