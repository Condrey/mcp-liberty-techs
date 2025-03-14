"use client";

import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PARAM_NAME_CATEGORY } from "@/lib/constants";
import { allCategories } from "@/lib/enums";
import { SalesChartData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ShopCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { getChartData } from "../action";

interface MonthlySalesChartProps {
  receipts: SalesChartData[];
}
export default function MonthlySalesChart({
  receipts,
}: MonthlySalesChartProps) {
  const searchParams = useSearchParams();
  const category = (searchParams.get(PARAM_NAME_CATEGORY) ||
    allCategories[0]) as ShopCategory;

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["sales-chart",category],
    queryFn: async () => getChartData(category),
    initialData: receipts,
  
  });

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
    return null;
  }

  let chartData = data
    .map((c) => {
      return {
            date: c.date,
            collected: c.collected,
            balance: c.balance,
            category: c.category,
          }
    })
    .filter(Boolean) as { date: string; collected: number; balance: number }[];

  chartData =
    chartData.length < 2
      ? [
          {
            date: "",
            collected: 0,
            balance: 0,
          },
          {
            date: "",
            collected: 0,
            balance: 0,
          },
          ...chartData,
          {
            date: "",
            collected: 0,
            balance: 0,
          },
          {
            date: "",
            collected: 0,
            balance: 0,
          },
        ]
      : chartData.length < 3
      ? [
          {
            date: "",
            collected: 0,
            balance: 0,
          },
          ...chartData,
          {
            date: "",
            collected: 0,
            balance: 0,
          },
        ]
      : chartData;

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
        {/* <pre>{JSON.stringify(chartData, null, 2)}</pre> */}
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
                  labelFormatter={(value) => {
                    return (
                      <span className=" uppercase">{`Sales for ${
                        value || "__ "
                      }, ${new Date().getFullYear()}`}</span>
                    );
                  }}
                  formatter={(value, name, item, index) => (
                    <>
                      <div className="shrink-0 rounded-[2px] bg-background ">
                        {chartConfig[name as keyof typeof chartConfig]?.label ||
                          name}
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(value as number)}
                        </div>
                      </div>
                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total amount
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {formatCurrency(
                              (item.payload.balance +
                                item.payload.collected) as number
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
            />
            <Bar
              stackId={"a"}
              radius={[0, 0, 4, 4]}
              dataKey="collected"
              fill={`#22c55e`}
            />
            <Bar
              stackId={"a"}
              radius={[4, 4, 0, 0]}
              dataKey="balance"
              fill={`#f43f5e`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground italic text-center w-full">
          A chart showing total monthly sales and pending dues,{" "}
          {new Date().getFullYear()}
        </p>
      </CardFooter>
    </Card>
  );
}
