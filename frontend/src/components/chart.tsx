"use client"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Download } from "lucide-react"
import { eslBigData } from "../data-esl-big"

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

// Transform ESL data to chart format
const transformESLData = () => {
  return eslBigData["esl-data"].map((entry) => {
    // Convert ISO date to readable month
    const date = new Date(entry.month)
    const monthName = date.toLocaleDateString("en-US", {
      month: "long",
      year: "2-digit"
    })

    // Create flat object with OBIS values
    const flat: { [key: string]: any } = {
      month: monthName,
      date: entry.month // Keep original date for sorting
    }

    entry.data.forEach((item) => {
      flat[item.obis] = item.value
    })

    return flat
  })
}

// Get transformed data
const eslTransformedData = transformESLData()  // OBIS code mappings using Tailwind green shades
export const obisConfig = {
  "1-1:1.8.1": {
    label: "High Tariff Purchase",
    color: "#93c5fd", // blue-300
  },
  "1-1:1.8.2": {
    label: "Low Tariff Purchase",
    color: "#2563eb", // blue-600
  },
  "1-1:2.8.1": {
    label: "High Tariff Feed-in",
    color: "#10b981", // green-500
  },
  "1-1:2.8.2": {
    label: "Low Tariff Feed-in",
    color: "#14532d", // green-900
  },
} satisfies ChartConfig

// Calculate Y-axis domain for proper scaling
const getAllValues = () => {
  const values: number[] = []
  eslTransformedData.forEach(entry => {
    Object.keys(obisConfig).forEach(obis => {
      if (entry[obis]) values.push(entry[obis])
    })
  })
  return values
}

const allValues = getAllValues()
const minValue = Math.min(...allValues)
const maxValue = Math.max(...allValues)
const yAxisMin = Math.floor(minValue / 1000) * 1000
const yAxisMax = Math.ceil(maxValue / 1000) * 1000

export function ChartComp({ preset = "" }: { preset?: string }) {
  const [currentData, setCurrentData] = useState(eslTransformedData)
  const [key, setKey] = useState(0) // Key for forcing animation on data change

  useEffect(() => {
    // For now, we'll always use the ESL data
    // You can extend this later to handle different presets
    setCurrentData(eslTransformedData)
    setKey(prev => prev + 1) // Update key to trigger animation
  }, [preset])

  // Function to download data as CSV
  const downloadCSV = () => {
    // Create CSV header row
    const headers = Object.keys(currentData[0]).join(',');

    // Create CSV content rows
    const csvRows = currentData.map((row: any) =>
      Object.values(row).join(',')
    );

    // Combine header and rows
    const csvContent = [headers, ...csvRows].join('\n');

    // Create downloadable blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `power-data-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download data as JSON
  const downloadJSON = () => {
    // Create JSON string from data
    const jsonContent = JSON.stringify(currentData, null, 2);

    // Create downloadable blob
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `power-data-${new Date().toISOString().slice(0, 10)}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-10/12">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Power Diagram</CardTitle>
        <Tabs defaultValue="day" className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>        <DropdownMenu>
          <DropdownMenuTrigger className="border px-3 py-1 rounded-sm font-medium flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={downloadCSV}>
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadJSON}>
              JSON
            </DropdownMenuItem>
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
          >            <ChartContainer config={obisConfig}>
              <AreaChart
                accessibilityLayer
                data={currentData} margin={{
                  left: 60,
                  right: 12,
                  top: 20,
                  bottom: 5
                }}
                height={400}
              >
                <CartesianGrid
                  vertical={false}
                  className="stroke-muted-foreground/20"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.split(' ')[0].slice(0, 3)}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={6}
                  domain={[yAxisMin, yAxisMax]}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k kWh`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />                <defs>
                  {Object.keys(obisConfig).map((obis) => (
                    <linearGradient key={obis} id={`fill-${obis}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={obisConfig[obis as keyof typeof obisConfig].color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={obisConfig[obis as keyof typeof obisConfig].color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {Object.keys(obisConfig).map((obis) => (
                  <Area
                    key={obis}
                    dataKey={obis}
                    type="natural"
                    fill={`url(#fill-${obis})`}
                    fillOpacity={0.4}
                    stroke={obisConfig[obis as keyof typeof obisConfig].color}
                    stackId="a"
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}