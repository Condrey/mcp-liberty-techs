"use client";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { receiptSchema, ReceiptSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useAddReceiptMutation } from "./mutation";

interface AddReceiptProps {
  receiptToEdit?: Receipt;
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function FormAddEditReceipt({
  receiptToEdit,
  open,
  setOpen,
}: AddReceiptProps) {
  const form = useForm<ReceiptSchema>({
    resolver: zodResolver(receiptSchema),
    values: {
      id: receiptToEdit?.id || "",
      amount: receiptToEdit?.amount || 0,
      balance: receiptToEdit?.balance || 0,
      client: receiptToEdit?.client || "",
      contact: receiptToEdit?.contact || "",
      name: receiptToEdit?.name || "",
      serialNumber: receiptToEdit?.serialNumber || "",
    },
  });
  const { mutate, isPending } = useAddReceiptMutation();
  function handleSubmit(input: ReceiptSchema) {
    mutate(input, {
      onSuccess() {
        setOpen(false);
      },
    });
  }
  return (
    <>
      <ResponsiveDrawer
        open={open}
        setOpen={setOpen}
        title={receiptToEdit ? "Add new receipt" : "Update receipt"}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dell latitude 6300 Monitor..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., IMEI 353912101126646"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Onyango Denis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end gap-4">
              <LoadingButton loading={isPending} type="submit">
                {receiptToEdit ? "Update" : "Submit"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
