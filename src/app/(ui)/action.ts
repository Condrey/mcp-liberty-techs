'use server'

import prisma from "@/lib/prisma";
import { receiptSchema, ReceiptSchema } from "@/lib/validation";
import { cache } from "react";

export async function receipts (){
    return await prisma.receipt.findMany({
        orderBy:{createdAt:'desc'}
    })

}
export const getAllReceipts = cache(receipts)


export async function upsertReceipt(input:ReceiptSchema){
    const {id, amount,balance,client,contact,name,serialNumber}  = receiptSchema.parse(input)
    const data = await prisma.receipt.upsert({
where:{id},
create:{amount,balance,client,contact,name,serialNumber},
update:{amount,balance,client,contact,name,serialNumber},
    });
    return data;
}