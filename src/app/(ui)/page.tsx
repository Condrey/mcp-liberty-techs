import { ShopCategory } from "@prisma/client";
import BtnChooseCategory from "./(tables)/btn-choose-category";
import { getAllReceipts, getChartData } from "./action";
import MonthlySalesChart from "./charts/monthly-sales-chart";
import ListOfDefaulters from "./list-of-defaulters";
import ListOfReceipts from "./list-of-receipts";
import { PARAM_NAME_CATEGORY } from "@/lib/constants";
import { allCategories } from "@/lib/enums";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface HomeProps{
  searchParams: SearchParams
}

export const dynamic = 'force-dynamic'

export default async function Home({searchParams}:HomeProps) {
  const category = (await searchParams)[PARAM_NAME_CATEGORY]

  const [receipts, chartData] = await Promise.all([
    getAllReceipts(),
    getChartData((category||allCategories[0]) as ShopCategory),
  ]);

  return (
    <div className="flex flex-col xl:flex-row gap-6  xl:gap-4 py-12 size-full px-4 ">
      <div className="w-full max-w-7xl gap-4 flex flex-col justify-center items-center mx-auto ">
    <span>{category}</span>
        <h1 className="text-5xl text-center font-bold uppercase  xl:after:content-['_Receipts']">
          MCP & Liberty computers
        </h1>
        {/* Graph  */}
        <BtnChooseCategory/>
        <MonthlySalesChart receipts={chartData} />
        {/* Previous receipts  */}
        <ListOfReceipts receipts={receipts} />
      </div>

      <div className=" xl:flex xl:sticky xl:top-10 xl:flex-col py-6 xl:py-0 ">
        <ListOfDefaulters />
      </div>
    </div>
  );
}
