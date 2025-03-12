'use client'

import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
    QueryKey,
  } from '@tanstack/react-query'
import { upsertReceipt } from './action'
import { Receipt } from '@prisma/client'
import { toast, useSonner } from 'sonner'
import kyInstance from '@/lib/ky'
  
  export const useAddReceiptMutation=()=>{
    const queryKey:QueryKey =  ["receipt-list"]
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn:upsertReceipt,
        async onSuccess(data, variables, context) {
            await queryClient.cancelQueries({queryKey})
            queryClient.setQueryData<Receipt[]>(queryKey,old=>{
                if(!old) return;
                if(!variables.id){
                    return [...old,data]
                }
                return old.map(d=>d.id===data.id?data:d)
            })
            const response = await kyInstance
            .post("/api/printer", {
              body: JSON.stringify(data),
            })
            .json<string>();
          toast(response);
        },
        onError(error, variables, context) {
            console.error(error)
            toast('Failed to update receipt list. Please try again.',)
        },
    })
    return mutation
}