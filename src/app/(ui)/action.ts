"use server";

import prisma from "@/lib/prisma";
import { receiptSchema, ReceiptSchema } from "@/lib/validation";
import { format } from "date-fns";
import { cache } from "react";

export async function receipts() {
  return await prisma.receipt.findMany({
    orderBy: { createdAt: "desc" },
  });
}
export const getAllReceipts = cache(receipts);

export async function payDebt({id,amount}:{id:string,amount:number}){
const data =  await prisma.receipt.update({
  where:{id},
  data:{
    amount:{increment:amount},
    balance:{decrement:amount}
  }
})
return data;
}

export async function getChartData() {
  const receipts = await getAllReceipts();
  const groupedKeyData: {
    [key: string]: {
      date: string;
      originalDate: Date;
      collected: number;
      balance: number;
    };
  } = {};
  const groupedData = receipts.reduce((acc, receipt) => {
    const date = format(receipt.createdAt, "LLLL");
    if (!acc[date]) {
      acc[date] = {
        date,
        collected: 0,
        balance: 0,
        originalDate: receipt.createdAt,
      };
    }
    acc[date].collected += Number(receipt.amount);
    acc[date].balance += Number(receipt.balance);
    return acc;
  }, groupedKeyData);
  return Object.values(groupedData).sort(
    (a, b) =>
      new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime()
  );
}

export async function getAllDefaulters() {
  return await prisma.receipt.findMany({
    where: { balance: { gt: 0 } },
    orderBy: { createdAt: "desc" },
  });
}

export async function upsertReceipt(input: ReceiptSchema) {
  const { id, amount, balance, client, contact, name, serialNumber } =
    receiptSchema.parse(input);
  const data = await prisma.receipt.upsert({
    where: { id },
    create: { amount, balance, client, contact, name, serialNumber },
    update: { amount, balance, client, contact, name, serialNumber },
  });
  return data;
}

export async function deleteReceipt(id: string) {
  const data = await prisma.receipt.delete({
    where: { id },
  });
  return data;
}
