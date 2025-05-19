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

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

// Base chart data
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

// Data for different presets
const presetData = {
  purchaseHighTariff: [
    { month: "January", desktop: 250, mobile: 120 },
    { month: "February", desktop: 380, mobile: 230 },
    { month: "March", desktop: 290, mobile: 150 },
    { month: "April", desktop: 120, mobile: 210 },
    { month: "May", desktop: 260, mobile: 160 },
    { month: "June", desktop: 280, mobile: 170 },
  ],
  purchaseLowTariff: [
    { month: "January", desktop: 150, mobile: 60 },
    { month: "February", desktop: 280, mobile: 180 },
    { month: "March", desktop: 200, mobile: 100 },
    { month: "April", desktop: 50, mobile: 160 },
    { month: "May", desktop: 180, mobile: 110 },
    { month: "June", desktop: 190, mobile: 120 },
  ],
  feedInHighTariff: [
    { month: "January", desktop: 100, mobile: 40 },
    { month: "February", desktop: 200, mobile: 120 },
    { month: "March", desktop: 150, mobile: 80 },
    { month: "April", desktop: 30, mobile: 100 },
    { month: "May", desktop: 130, mobile: 70 },
    { month: "June", desktop: 140, mobile: 80 },
  ],
  feedInLowTariff: [
    { month: "January", desktop: 80, mobile: 30 },
    { month: "February", desktop: 150, mobile: 90 },
    { month: "March", desktop: 120, mobile: 60 },
    { month: "April", desktop: 20, mobile: 80 },
    { month: "May", desktop: 100, mobile: 50 },
    { month: "June", desktop: 110, mobile: 60 },
  ],
  purchase: [
    { month: "January", desktop: 200, mobile: 90 },
    { month: "February", desktop: 330, mobile: 205 },
    { month: "March", desktop: 245, mobile: 125 },
    { month: "April", desktop: 85, mobile: 185 },
    { month: "May", desktop: 220, mobile: 140 },
    { month: "June", desktop: 235, mobile: 150 },
  ],
  feedIn: [
    { month: "January", desktop: 90, mobile: 35 },
    { month: "February", desktop: 175, mobile: 105 },
    { month: "March", desktop: 135, mobile: 70 },
    { month: "April", desktop: 25, mobile: 90 },
    { month: "May", desktop: 115, mobile: 60 },
    { month: "June", desktop: 125, mobile: 70 },
  ],
  consumptionChart: [
    { month: "January", desktop: 300, mobile: 150 },
    { month: "February", desktop: 450, mobile: 280 },
    { month: "March", desktop: 350, mobile: 200 },
    { month: "April", desktop: 150, mobile: 250 },
    { month: "May", desktop: 320, mobile: 190 },
    { month: "June", desktop: 340, mobile: 210 },
  ],
  meterReadingChart: [
    { month: "January", desktop: 400, mobile: 200 },
    { month: "February", desktop: 850, mobile: 480 },
    { month: "March", desktop: 1200, mobile: 680 },
    { month: "April", desktop: 1350, mobile: 930 },
    { month: "May", desktop: 1670, mobile: 1120 },
    { month: "June", desktop: 2010, mobile: 1330 },
  ],
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
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
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger className="border px-3 py-1 rounded-sm font-medium">Download</DropdownMenuTrigger>
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
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={currentData}
                margin={{
                  left: 35,
                  right: 12,
                  top: 5,
                  bottom: 5
                }}
                height={400}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value}`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-desktop)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-mobile)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="mobile"
                  type="natural"
                  fill="url(#fillMobile)"
                  fillOpacity={0.4}
                  stroke="var(--color-mobile)"
                  stackId="a"
                />
                <Area
                  dataKey="desktop"
                  type="natural"
                  fill="url(#fillDesktop)"
                  fillOpacity={0.4}
                  stroke="var(--color-desktop)"
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