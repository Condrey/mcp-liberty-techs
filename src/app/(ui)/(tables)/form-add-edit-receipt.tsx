"use client";

import LoadingButton from "@/components/loading-button";
import { NumberInput } from "@/components/number-input/number-input";
import ResponsiveDrawer from "@/components/responsive-drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allCategories, shopCategories } from "@/lib/enums";
import { receiptSchema, ReceiptSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt, ShopCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useAddReceiptMutation } from "./mutation";
import { webCurrency } from "@/lib/utils";

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
      model: receiptToEdit?.model || "",
      category: receiptToEdit?.category || ShopCategory.MCP,
    },
  });
  const category = form.watch("category");
  const isMCP = category === ShopCategory.MCP

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
        title={receiptToEdit ? "Update receipt" : "Add new receipt"}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a shop type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((category) => {
                        const c = shopCategories[category];
                        const Icon = c.icon;
                        return (
                          <SelectItem value={category} key={category
                            
                          }>
                            <div className="flex gap-2 items-center">
                              <Icon className="size-4" />
                              <span>{c.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs italic">
                    Please make sure to choose a correct category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isMCP?'CAMON 40 50MP, Tecno AI':'Dell latitude 6300 Monitor...'}
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
                  <FormLabel>Amount being paid</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="e.g., 50000" {...field} suffix={webCurrency}/>
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
                    <NumberInput placeholder="e.g., 2000" {...field} suffix={webCurrency}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isMCP ? (
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
            ) : (
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., series 36200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isMCP?'e.g., Onyango Denis Red Lion':"e.g., Aaron Keziah"}
                      {...field}
                    />
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
                    <Input placeholder="e.g., 0771234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end gap-4">
              <LoadingButton loading={isPending} type="submit">
                {receiptToEdit ? "Update receipt" : "Submit and print"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </ResponsiveDrawer>
    </>
  );
}
