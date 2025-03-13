import { NumberInput } from "@/components/number-input/number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePayBalanceMutation } from "./mutation";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {useState} from 'react'
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Receipt } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

export default function BtnPayBalance({ receipt }: { receipt: Receipt }) {
  const schema = z.object({
    amount: z.number(),
  });
  type Schema = z.infer<typeof schema>;
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = usePayBalanceMutation();
  function onSubmit(input: Schema) {
    mutate({amount:input.amount, id:receipt.id },{onSuccess:()=>setOpen(false)});
  }
  const [open,setOpen] = useState(false)
  return (
    <>
    <Button variant='secondary' onClick={()=>setOpen(true)}>
        Pay Balance</Button>
     <ResponsiveDrawer
     open={open}
     setOpen={setOpen}
     title={`Pay pending balance for ${receipt.client}, ${receipt.contact}`}
     description={`Pending balance of ${formatCurrency(receipt.balance)}`}
     >
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment amount</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder="Please enter amount..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end ">
            <LoadingButton loading={isPending} type="submit">
                Add payment
            </LoadingButton>
          </div>
        </form>
      </Form>
     </ResponsiveDrawer>
    </>
  );
}
