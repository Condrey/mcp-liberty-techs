import { ShopCategory } from "@prisma/client";
import { z } from "zod";

const requiredString = z.string().min(1,'Required')
export const receiptSchema = z.object({
    id:z.string().optional(),
    name:requiredString,
    amount:z.number(),
    balance:z.number(),
    contact:requiredString,
    client:requiredString,
    serialNumber:z.string(),
    model:z.string(),
    category: z.nativeEnum(ShopCategory).default(ShopCategory.MCP)
}).superRefine((data,ctx)=>{
    if(data.category === ShopCategory.MCP && !data.serialNumber){
        ctx.addIssue({
            path:["serialNumber"],
            message:'Serial number is required for this item',
            code:'custom'
        })
    }else if(data.category !== ShopCategory.MCP && !data.model){
        ctx.addIssue({
            path:['model'],
            message:'Model is required.',
            code:'custom'
        })
    }
})
export type ReceiptSchema  = z.infer<typeof receiptSchema>