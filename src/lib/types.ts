// export const receiptDataInclude = {} satisfies Prisma.Receipt

export interface SalesChartData {
  date: string;
  collected: number;
  balance: number;
  originalDate: Date;
}
