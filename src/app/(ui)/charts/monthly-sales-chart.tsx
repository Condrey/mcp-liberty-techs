"use client";

import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SalesChartData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getChartData } from "../action";

interface MonthlySalesChartProps {
  receipts: SalesChartData[];
}
export default function MonthlySalesChart({
  receipts, 
}: MonthlySalesChartProps) {
  const { data, status, error, refetch, isFetching } = useQuery(
    {
      queryKey:['sales-chart'],
      queryFn:getChartData,
      initialData:receipts
    }
  )


  if (status === "error") {
    console.error(error);
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-[20rem]">
        <p className="text-center max-w-sm text-muted-foreground">
          An error occurred while fetching chart data.
        </p>
        <LoadingButton
          className="w-fit"
          loading={isFetching}
          onClick={() => refetch()}
        >
          Refresh
        </LoadingButton>
      </div>
    );
  }
  if (status === "success" && !data.length) {
    return null
  }

  let chartData = data.map((c) => ({
    date: c.date,
    collected: c.collected,
    balance: c.balance,
  }));

  chartData = chartData.length <2 ?[
    {
      date: "",
      collected:0,
      balance:0
    }, {
      date: "",
      collected:0,
      balance:0
    },
    ...chartData,{
      date: "",
      collected:0,
      balance:0
    }, {
      date: "",
      collected:0,
      balance:0
    },
  ]:
  chartData.length<3?[
    {
      date: "",
      collected:0,
      balance:0
    },
    ...chartData,{
      date: "",
      collected:0,
      balance:0
    },
  ]:
  chartData

  const chartConfig = {
    sales: {
      label: "Sales",
    },
    collected: {
      label: "Amount collected",
      color: "hsl(var(--chart-1))",
    },
    balance: {
      label: "Pending balance",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;


  return (
    <Card className="w-full max-w-3xl shadow-none border-0">
      <CardContent>
        
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[100px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
             
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="date"
             
                />
              }
            />
            <Bar dataKey='collected' fill={`#22c55e`} />
            <Bar dataKey='balance' fill={`#f43f5e`} />
          </BarChart>
        </ChartContainer>
        
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">A chart showing total monthly sales and pending dues</p>
        </CardFooter>
    </Card>
  );
}
