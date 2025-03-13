import { getAllReceipts, getChartData } from "./action";
import MonthlySalesChart from "./charts/monthly-sales-chart";
import ListOfDefaulters from "./list-of-defaulters";
import ListOfReceipts from "./list-of-receipts";

export default async function Home() {
  const [receipts,chartData] = await Promise.all(
    [
      getAllReceipts(),getChartData()
    ]
  ) 

  return (
    <div className="flex  gap-4 py-12 size-full px-4 ">
      <div className="w-full max-w-7xl gap-4 flex flex-col justify-center items-center mx-auto ">
        {/* logo  */}
        <h1 className="text-5xl text-center font-bold uppercase">
          MCP & Liberty computers
        </h1>
        {/* Graph  */}
        <MonthlySalesChart receipts={chartData} />
        {/* Previous receipts  */}
        <ListOfReceipts receipts={receipts} />
      </div>

      <ListOfDefaulters/>
    </div>
  );
}
