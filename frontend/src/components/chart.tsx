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

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

// Base chart data - Power consumption in kWh
const chartData = [
  { month: "January", consumption: 450, production: 320 },
  { month: "February", consumption: 520, production: 380 },
  { month: "March", consumption: 480, production: 420 },
  { month: "April", consumption: 420, production: 480 },
  { month: "May", consumption: 380, production: 520 },
  { month: "June", consumption: 360, production: 580 },
]

// Data for different presets
const presetData = {
  purchaseHighTariff: [
    { month: "January", consumption: 580, production: 220 },
    { month: "February", consumption: 650, production: 280 },
    { month: "March", consumption: 620, production: 320 },
    { month: "April", consumption: 560, production: 380 },
    { month: "May", consumption: 520, production: 420 },
    { month: "June", consumption: 480, production: 460 },
  ],
  purchaseLowTariff: [
    { month: "January", consumption: 320, production: 420 },
    { month: "February", consumption: 380, production: 480 },
    { month: "March", consumption: 360, production: 520 },
    { month: "April", consumption: 340, production: 560 },
    { month: "May", consumption: 300, production: 600 },
    { month: "June", consumption: 280, production: 640 },
  ],
  feedInHighTariff: [
    { month: "January", consumption: 200, production: 680 },
    { month: "February", consumption: 240, production: 720 },
    { month: "March", consumption: 220, production: 760 },
    { month: "April", consumption: 180, production: 800 },
    { month: "May", consumption: 160, production: 840 },
    { month: "June", consumption: 140, production: 880 },
  ],
  feedInLowTariff: [
    { month: "January", consumption: 280, production: 520 },
    { month: "February", consumption: 320, production: 560 },
    { month: "March", consumption: 300, production: 600 },
    { month: "April", consumption: 260, production: 640 },
    { month: "May", consumption: 240, production: 680 },
    { month: "June", consumption: 220, production: 720 },
  ],
  purchase: [
    { month: "January", consumption: 520, production: 280 },
    { month: "February", consumption: 580, production: 320 },
    { month: "March", consumption: 560, production: 360 },
    { month: "April", consumption: 500, production: 400 },
    { month: "May", consumption: 460, production: 440 },
    { month: "June", consumption: 420, production: 480 },
  ],
  feedIn: [
    { month: "January", consumption: 240, production: 600 },
    { month: "February", consumption: 280, production: 640 },
    { month: "March", consumption: 260, production: 680 },
    { month: "April", consumption: 220, production: 720 },
    { month: "May", consumption: 200, production: 760 },
    { month: "June", consumption: 180, production: 800 },
  ],
  consumptionChart: [
    { month: "January", consumption: 680, production: 120 },
    { month: "February", consumption: 720, production: 160 },
    { month: "March", consumption: 700, production: 140 },
    { month: "April", consumption: 640, production: 180 },
    { month: "May", consumption: 600, production: 200 },
    { month: "June", consumption: 580, production: 220 },
  ],
  meterReadingChart: [
    { month: "January", consumption: 400, production: 200 },
    { month: "February", consumption: 850, production: 480 },
    { month: "March", consumption: 1200, production: 680 },
    { month: "April", consumption: 1350, production: 930 },
    { month: "May", consumption: 1670, production: 1120 },
    { month: "June", consumption: 2010, production: 1330 },
  ],
}

const chartConfig = {
  consumption: {
    label: "Power Consumption",
    color: "hsl(var(--chart-1))",
  },
  production: {
    label: "Power Production",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartComp({ preset = "" }: { preset?: string }) {
  const [currentData, setCurrentData] = useState(chartData)
  const [key, setKey] = useState(0) // Key for forcing animation on data change

  useEffect(() => {
    if (preset && preset in presetData) {
      setCurrentData(presetData[preset as keyof typeof presetData])
      setKey(prev => prev + 1) // Update key to trigger animation
    } else {
      setCurrentData(chartData)
      setKey(prev => prev + 1) // Update key to trigger animation
    }
  }, [preset])

  // Function to download data as CSV
  const downloadCSV = () => {
    // Create CSV header row
    const headers = Object.keys(currentData[0]).join(',');

    // Create CSV content rows
    const csvRows = currentData.map(row =>
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
        <CardTitle>Leistungsdiagramm</CardTitle>
        <Tabs defaultValue="day" className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="day">Tag</TabsTrigger>
            <TabsTrigger value="month">Monat</TabsTrigger>
            <TabsTrigger value="year">Jahr</TabsTrigger>
            <TabsTrigger value="custom">Individuell</TabsTrigger>
          </TabsList>
        </Tabs>        <DropdownMenu>
          <DropdownMenuTrigger className="border px-3 py-1 rounded-sm font-medium flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Herunterladen
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
          >
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={currentData} margin={{
                  left: 60,
                  right: 12,
                  top: 20,
                  bottom: 5
                }}
                height={400}
              >                <CartesianGrid 
                  vertical={false} 
                  className="stroke-muted-foreground/20"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value} kWh`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />                <defs>
                  <linearGradient id="fillConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-2))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="production"
                  type="natural"
                  fill="url(#fillProduction)"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-2))"
                  stackId="a"
                />
                <Area
                  dataKey="consumption"
                  type="natural"
                  fill="url(#fillConsumption)"
                  fillOpacity={0.4}
                  stroke="hsl(var(--chart-1))"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}