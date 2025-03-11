import { z } from "zod";

const requiredString = z.string().min(1,'Required')
export const receiptSchema = z.object({
    id:z.string().optional(),
    name:requiredString,
    amount:z.number(),
    balance:z.number(),
    contact:requiredString,
    client:requiredString,
    serialNumber:requiredString
})
export type ReceiptSchema  = z.infer<typeof receiptSchema>