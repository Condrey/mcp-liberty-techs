// export const receiptDataInclude = {} satisfies Prisma.Receipt

import { ShopCategory } from "@prisma/client";

export interface SalesChartData {
  date: string;
  collected: number;
  balance: number;
  originalDate: Date;
  category: ShopCategory
}
