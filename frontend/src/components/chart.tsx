"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { eslBig } from "@/data-esl-big";

// Sample ESL data
const eslData = eslBig["esl-data"];

// Transform the data
const transformedData = eslData.map((entry) => {
  const flat: { [key: string]: number | string } = { month: entry.month };
  entry.data.forEach((item) => {
    flat[item.obis] = item.value;
  });
  return flat;
});

// Define OBIS codes with color tokens
const obisCodes = [
  { key: "1-1:1.8.1", label: "High Tariff Purchase", colorVar: "--chart-1" },
  { key: "1-1:1.8.2", label: "Low Tariff Purchase", colorVar: "--chart-2" },
  { key: "1-1:2.8.1", label: "High Tariff Feed-in", colorVar: "--chart-3" },
  { key: "1-1:2.8.2", label: "Low Tariff Feed-in", colorVar: "--chart-4" },
];

// Calculate Y-axis domain
const allValues = transformedData.flatMap(entry => 
  obisCodes.map(code => Number(entry[code.key]) || 0)
);
const minValue = Math.min(...allValues);
const maxValue = Math.max(...allValues);
const yAxisMin = Math.floor(minValue / 1000) * 1000;
const yAxisMax = Math.ceil(maxValue / 1000) * 1000;

export function ChartComp() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <Card className="w-10/12">
      <CardHeader className="flex justify-between items-center gap-4 flex-wrap">
        <CardTitle>Power Diagram</CardTitle>
        <Tabs defaultValue="month" className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger className="border px-3 py-1 rounded-sm font-medium">
            Download
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>csv</DropdownMenuItem>
            <DropdownMenuItem>json</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChartContainer
              config={Object.fromEntries(
                obisCodes.map((o) => [o.key, { label: o.label, color: `hsl(var(${o.colorVar}))` }])
              )}
            >
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={transformedData} margin={{ left: 35, right: 12, top: 5, bottom: 5 }}>
                  <defs>
                    {obisCodes.map((obis) => (
                      <linearGradient id={`fill-${obis.key}`} x1="0" y1="0" x2="0" y2="1" key={obis.key}>
                        <stop offset="5%" stopColor={`var(${obis.colorVar})`} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={`var(${obis.colorVar})`} stopOpacity={0.1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-CH", {
                        month: "short",
                        year: "2-digit",
                      })
                    }
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    tickCount={6}
                    domain={[yAxisMin, yAxisMax]}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  {obisCodes.map((obis) => (
                    <Area
                      key={obis.key}
                      type="natural"
                      dataKey={obis.key}
                      name={obis.label}
                      stroke={`var(${obis.colorVar})`}
                      fill={`url(#fill-${obis.key})`}
                      fillOpacity={0.4}
                      stackId="a"
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
