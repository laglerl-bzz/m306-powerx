"use client"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Download } from "lucide-react"
import { eslBigData } from "../data-esl-big"
import { sdatBig } from "../data-sdat-big"
import { sdatMonthlyData as sdatMonthlyDataFile } from "../data-sdat-monthly"

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

// Transform SDAT data to chart format
const transformSDATData = () => {
  // Group data by documentID to separate feed-in and feed-out
  const groupedData: { [key: string]: any[] } = {}

  sdatBig["sdat-data"].forEach((entry) => {
    if (!groupedData[entry.documentID]) {
      groupedData[entry.documentID] = []
    }

    // Create time series data points for each sequence
    entry.data.forEach((point) => {
      const startDate = new Date(entry.interval.startDateTime)
      // Calculate time for this sequence (resolution is in minutes)
      const timeOffset = (point.sequence - 1) * entry.resolution * 60 * 1000 // Convert to milliseconds
      const pointTime = new Date(startDate.getTime() + timeOffset)

      const timeLabel = pointTime.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
      })

      groupedData[entry.documentID].push({
        time: timeLabel,
        sequence: point.sequence,
        volume: point.volume,
        timestamp: pointTime.getTime(),
        documentID: entry.documentID
      })
    })
  })

  // Combine data from both document IDs into a single time series
  const allTimePoints: { [key: string]: any } = {}

  Object.keys(groupedData).forEach(docId => {
    groupedData[docId].forEach(point => {
      const key = point.time
      if (!allTimePoints[key]) {
        allTimePoints[key] = {
          month: point.time, // Using 'month' as the x-axis key for consistency
          time: point.time,
          timestamp: point.timestamp
        }
      }
      // ID735 = Bezug (Purchase), ID742 = Einspeisung (Feed-in)
      if (docId === 'ID735') {
        allTimePoints[key]['bezug'] = point.volume
      } else if (docId === 'ID742') {
        allTimePoints[key]['einspeisung'] = point.volume
      }
    })
  })

  // Convert to array and sort by timestamp
  return Object.values(allTimePoints).sort((a: any, b: any) => a.timestamp - b.timestamp)
}

// Transform SDAT data for monthly view using sdatMonthlyData
const transformSDATMonthly = () => {
  // Initialize a map to store daily sums
  const dayMap: { [date: string]: { bezug: number; einspeisung: number; timestamp: number; readings: number } } = {};

  // Process each entry in the SDAT data
  sdatMonthlyDataFile["sdat-data"].forEach((entry: any) => {
    const dateObj = new Date(entry.interval.startDateTime);
    const dateStr = dateObj.toISOString().split("T")[0];
    
    // Initialize the day entry if it doesn't exist
    if (!dayMap[dateStr]) {
      dayMap[dateStr] = {
        bezug: 0,
        einspeisung: 0,
        timestamp: dateObj.getTime(),
        readings: 0
      };
    }

    // Sum up all volumes for this day
    if (entry.data) {
      const dailySum = entry.data.reduce((sum: number, point: any) => sum + point.volume, 0);
      if (entry.documentID === "ID735") {
        dayMap[dateStr].bezug += dailySum;
      } else if (entry.documentID === "ID742") {
        dayMap[dateStr].einspeisung += dailySum;
      }
      dayMap[dateStr].readings += entry.data.length;
    }
  });

  // Convert the map to an array of daily data points
  return Object.entries(dayMap).map(([date, vals]) => {
    const dateObj = new Date(date);
    return {
      month: dateObj.toLocaleDateString("de-DE", { 
        day: "2-digit",
        month: "2-digit"
      }),
      fullDate: dateObj.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        weekday: "long"
      }),
      time: dateObj.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      timestamp: vals.timestamp,
      bezug: +vals.bezug.toFixed(2),
      einspeisung: +vals.einspeisung.toFixed(2),
      totalReadings: vals.readings
    };
  }).sort((a, b) => a.timestamp - b.timestamp);
}

// Get transformed data
const eslTransformedData = transformESLData()
const sdatTransformedData = transformSDATData()
const sdatMonthlyData = transformSDATMonthly()

// OBIS code mappings for ESL data
export const obisConfig = {
  "1-1:1.8.1": {
    label: "Bezug Hochtarif",
    color: "#93c5fd", // blue-300
  },
  "1-1:1.8.2": {
    label: "Bezug Niedertarif",
    color: "#2563eb", // blue-600
  },
  "1-1:2.8.1": {
    label: "Einspeisung Hochtarif",
    color: "#10b981", // green-500
  },
  "1-1:2.8.2": {
    label: "Einspeisung Niedertarif",
    color: "#14532d", // green-900
  },
} satisfies ChartConfig

// SDAT document ID mappings for SDAT data
export const sdatConfig = {
  "bezug": {
    label: "Bezug",
    color: "#2563eb",
  },
  "einspeisung": {
    label: "Einspeisung",
    color: "#10b981",
  },
} satisfies ChartConfig

export function ChartComp({ preset = "", onTimespanChange }: { preset?: string; onTimespanChange?: (timespan: string) => void }) {
  const [currentData, setCurrentData] = useState(eslTransformedData)
  const [currentConfig, setCurrentConfig] = useState<ChartConfig>(obisConfig)
  const [selectedTimespan, setSelectedTimespan] = useState("month")
  const [key, setKey] = useState(0) // Key for forcing animation on data change  

  // Function to determine which data to use based on timespan
  const getDataForTimespan = (timespan: string) => {
    // Day view uses daily SDAT data
    if (timespan === "day") {
      return { data: sdatTransformedData, config: sdatConfig as ChartConfig }
    }
    // Month uses aggregated monthly SDAT data
    if (timespan === "month") {
      return { data: sdatMonthlyData, config: sdatConfig as ChartConfig }
    }
    // Custom view - use SDAT for periods under 3 months, ESL for longer periods
    if (timespan === "custom") {
      // Get the date range of the data
      const sdatDates = sdatMonthlyData.map(d => new Date(d.timestamp));
      const minDate = new Date(Math.min(...sdatDates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...sdatDates.map(d => d.getTime())));
      
      // Calculate the difference in months
      const monthsDiff = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + 
                        (maxDate.getMonth() - minDate.getMonth());
      
      // Use SDAT data for periods under 3 months
      if (monthsDiff < 3) {
        return { data: sdatMonthlyData, config: sdatConfig as ChartConfig }
      }
    }
    // Year and longer custom periods use ESL data
    return { data: eslTransformedData, config: obisConfig as ChartConfig }
  }

  // For SDAT data (smaller values), use different scaling
  const isSDATData = selectedTimespan === "day" || selectedTimespan === "month" || selectedTimespan === "custom"

  useEffect(() => {
    const { data, config } = getDataForTimespan(selectedTimespan)
    setCurrentData(data)
    setCurrentConfig(config)
    setKey(prev => prev + 1) // Update key to trigger animation
  }, [selectedTimespan, preset])

  // Format x-axis ticks based on timespan
  const formatXAxisTick = (value: string) => {
    if (selectedTimespan === "month") {
      // For monthly view, show only DD.MM
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        // If value is already in DD.MM format
        return value;
      }
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit"
      });
    } else if (selectedTimespan === "day") {
      // For daily view, show time HH:mm
      return value;
    } else if (selectedTimespan === "custom") {
      // For custom view, format depends on the data being shown
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        // If it's already formatted or ESL data
        return value.split(' ')[0].slice(0, 3);
      }
      // For SDAT data in custom view
      return date.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit"
      });
    } else {
      // For yearly view, show abbreviated month
      return value.split(' ')[0].slice(0, 3);
    }
  };

  // Handle timespan change
  const handleTimespanChange = (value: string) => {
    setSelectedTimespan(value)
    onTimespanChange?.(value) // Notify parent component
  }

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
        <CardTitle>
          {isSDATData ? "Verbrauchsdiagramm" : "Leistungsdiagramm"}
        </CardTitle>
        <Tabs value={selectedTimespan} onValueChange={handleTimespanChange} className="w-[400px]">
          <TabsList className="w-full">
            <TabsTrigger value="day">Tag</TabsTrigger>
            <TabsTrigger value="month">Monat</TabsTrigger>
            <TabsTrigger value="year">Jahr</TabsTrigger>
            <TabsTrigger value="custom">Individuell</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu>
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
            <ChartContainer config={currentConfig}>
              <AreaChart
                accessibilityLayer
                data={currentData}
                margin={{
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
                  tickFormatter={formatXAxisTick}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={6}
                  domain={[0, 'dataMax']}
                  allowDataOverflow={false}
                  tickFormatter={(value) =>
                    isSDATData
                      ? `${value.toFixed(1)} kWh`
                      : `${(value / 1000).toFixed(1)}k kWh`
                  }
                  className="fill-muted-foreground"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  {Object.keys(currentConfig).map((key) => (
                    <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={currentConfig[key].color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={currentConfig[key].color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                {Object.keys(currentConfig).map((key) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#fill-${key})`}
                    fillOpacity={0.4}
                    stroke={currentConfig[key].color}
                    strokeWidth={2}
                    connectNulls={false}
                    baseLine={0}
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

// Update the ChartTooltipContent component to show correct data for all views
function ChartTooltipContent({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  // Determine if we're in SDAT view (monthly/daily) or ESL view (yearly)
  const isSDATView = data.hasOwnProperty('bezug') || data.hasOwnProperty('einspeisung');
  const currentConfig: ChartConfig = isSDATView ? sdatConfig : obisConfig;

  return (
    <div className="rounded-lg bg-white/90 p-4 shadow-lg border border-gray-200 backdrop-blur-sm">
      <p className="font-semibold mb-2">{data.fullDate || data.month}</p>
      {payload.map((entry: any) => {
        const configKey = entry.dataKey as string;
        const itemConfig = currentConfig[configKey];
        if (!itemConfig) return null;
        const value = isSDATView 
          ? `${entry.value.toFixed(2)} kWh`
          : `${(entry.value / 1000).toFixed(1)}k kWh`;
        return (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {itemConfig.label}: {value}
            </span>
          </div>
        );
      })}
      {data.totalReadings && (
        <p className="text-xs text-gray-500 mt-2">
          Tagessumme aus {data.totalReadings} Messungen
        </p>
      )}
    </div>
  );
}