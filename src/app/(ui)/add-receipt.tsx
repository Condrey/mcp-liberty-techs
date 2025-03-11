'use client'

import LoadingButton from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { receiptSchema, ReceiptSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface AddReceiptProps{
    receiptToEdit:string
}
export default function AddReceipt(){
    const [open,setOpen] =useState(false)
    const form = useForm<ReceiptSchema>({
        resolver:zodResolver(receiptSchema),
        defaultValues:{

        }
    })
    function handleSubmit(input:ReceiptSchema){}
    return <>
     <Button className="w-full max-w-fit ml-auto"
    onClick={()=>setOpen(true)}>
        New receipt
    </Button>
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent>
<DialogHeader>
    <DialogTitle>
        Add new receipt
    </DialogTitle>
    </DialogHeader>
   <Form {...form}>
<form onSubmit={form.handleSubmit(handleSubmit)}
className="space-y-4">
<FormField
control={form.control}
name='name'
render={({field})=>(
    <FormItem>
        <FormLabel>Product</FormLabel>
        <FormControl>
            <Input placeholder='Dell latitude 6300 Monitor...'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/>
<FormField
control={form.control}
name='amount'
render={({field})=>(
    <FormItem>
        <FormLabel>Amount</FormLabel>
        <FormControl>
            <Input placeholder='e.g., 50000'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/>
<FormField
control={form.control}
name='balance'
render={({field})=>(
    <FormItem>
        <FormLabel>Balance</FormLabel>
        <FormControl>
            <Input placeholder='e.g., 50000'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/>
<FormField
control={form.control}
name='serialNumber'
render={({field})=>(
    <FormItem>
        <FormLabel>Serial number</FormLabel>
        <FormControl>
            <Input placeholder='e.g., IMEI 353912101126646'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/><FormField
control={form.control}
name='client'
render={({field})=>(
    <FormItem>
        <FormLabel>Client name</FormLabel>
        <FormControl>
            <Input placeholder='e.g., Onyango Denis'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/>
<FormField
control={form.control}
name='contact'
render={({field})=>(
    <FormItem>
        <FormLabel>Contact</FormLabel>
        <FormControl>
            <Input placeholder='e.g., 50000'/>
        </FormControl>
        <FormMessage/>
    </FormItem>
)}
/>
<div className="flex w-full justify-end gap-4">
    <LoadingButton loading={form.formState.isSubmitting}>
        Submit
    </LoadingButton>
    </div>
</form>
   </Form>
        </DialogContent>
    </Dialog>
    </>
}